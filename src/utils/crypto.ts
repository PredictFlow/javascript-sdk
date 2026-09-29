import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Computes an HMAC-SHA256 signature for a payload.
 */
export function computeHmacSha256(payload: string | Buffer | Uint8Array, secret: string, encoding: 'hex' | 'base64' = 'hex'): string {
  const hmac = createHmac('sha256', secret);
  hmac.update(payload);
  return hmac.digest(encoding);
}

/**
 * Constant-time string / buffer equality check to protect against timing attacks.
 */
export function secureCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) {
      return false;
    }
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

/**
 * Verifies if an HMAC signature matches the payload.
 * Supports both Hex and Base64 signatures, as well as `t=...,v1=...` formatted signatures.
 */
export function verifySignature(
  payload: string | Buffer | Uint8Array,
  signature: string,
  secret: string
): boolean {
  if (!signature || !secret) {
    return false;
  }

  const cleanSignature = signature.trim();

  // If header is in standard timestamp format: "t=1700000000,v1=abc123"
  if (cleanSignature.includes('t=') && cleanSignature.includes('v1=')) {
    const parts = cleanSignature.split(',');
    let timestamp = '';
    let sigV1 = '';

    for (const part of parts) {
      const [key, value] = part.split('=');
      if (key?.trim() === 't') timestamp = value?.trim() || '';
      if (key?.trim() === 'v1') sigV1 = value?.trim() || '';
    }

    if (!timestamp || !sigV1) {
      return false;
    }

    const payloadString = typeof payload === 'string' ? payload : Buffer.from(payload).toString('utf8');
    const signedPayload = `${timestamp}.${payloadString}`;
    const expectedHex = computeHmacSha256(signedPayload, secret, 'hex');

    return secureCompare(sigV1, expectedHex);
  }

  // Check Hex digest
  const expectedHex = computeHmacSha256(payload, secret, 'hex');
  if (secureCompare(cleanSignature, expectedHex)) {
    return true;
  }

  // Check Base64 digest
  const expectedBase64 = computeHmacSha256(payload, secret, 'base64');
  return secureCompare(cleanSignature, expectedBase64);
}
