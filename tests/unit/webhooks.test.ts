import { describe, it, expect } from 'vitest';
import { computeHmacSha256, verifySignature } from '../../src/utils/crypto';
import { WebhooksResource } from '../../src/resources/webhooks';
import { HttpClient } from '../../src/core/http-client';
import { resolveConfig } from '../../src/config';
import { ValidationError } from '../../src/core/errors';

describe('Webhooks & HMAC Signature Verification', () => {
  const secret = 'whsec_test_secret_key_xyz_789';
  const rawPayload = JSON.stringify({
    id: 'evt_123',
    event: 'inventory.low_stock',
    store_id: 'store_99',
    timestamp: '2026-09-29T12:00:00Z',
    data: {
      product_id: 'prod_101',
      sku: 'WIDGET-BLK',
      current_stock: 2,
    },
  });

  const http = new HttpClient(resolveConfig({ apiKey: 'pf_test' }));
  const webhooks = new WebhooksResource(http);

  it('should verify valid Hex signature correctly', () => {
    const signature = computeHmacSha256(rawPayload, secret, 'hex');
    const isValid = verifySignature(rawPayload, signature, secret);
    expect(isValid).toBe(true);
  });

  it('should verify valid Base64 signature correctly', () => {
    const signature = computeHmacSha256(rawPayload, secret, 'base64');
    const isValid = verifySignature(rawPayload, signature, secret);
    expect(isValid).toBe(true);
  });

  it('should verify timestamped signature (t=...,v1=...)', () => {
    const timestamp = '1727611200';
    const signedPayload = `${timestamp}.${rawPayload}`;
    const v1 = computeHmacSha256(signedPayload, secret, 'hex');
    const header = `t=${timestamp},v1=${v1}`;

    const isValid = verifySignature(rawPayload, header, secret);
    expect(isValid).toBe(true);
  });

  it('should reject invalid signature', () => {
    const isValid = verifySignature(rawPayload, 'invalid_signature_hex_12345', secret);
    expect(isValid).toBe(false);
  });

  it('should construct strongly-typed WebhookEvent on valid signature', () => {
    const signature = computeHmacSha256(rawPayload, secret, 'hex');
    const event = webhooks.constructEvent<{ product_id: string; sku: string; current_stock: number }>({
      payload: rawPayload,
      signature,
      secret,
    });

    expect(event.id).toBe('evt_123');
    expect(event.event).toBe('inventory.low_stock');
    expect(event.data.sku).toBe('WIDGET-BLK');
    expect(event.data.current_stock).toBe(2);
  });

  it('should throw ValidationError if constructEvent receives bad signature', () => {
    expect(() => {
      webhooks.constructEvent({
        payload: rawPayload,
        signature: 'bad_signature',
        secret,
      });
    }).toThrow(ValidationError);
  });
});
