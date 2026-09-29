import { BaseResource } from '../core/base-resource';
import { ValidationError } from '../core/errors';
import { verifySignature } from '../utils/crypto';
import { VerifyWebhookSignatureOptions, WebhookEvent } from '../types/webhooks.types';

export class WebhooksResource extends BaseResource {
  /**
   * Verifies the cryptographic HMAC signature of an incoming PredictFlow webhook.
   * Returns true if valid, false otherwise.
   */
  verifySignature(options: VerifyWebhookSignatureOptions): boolean {
    return verifySignature(options.payload, options.signature, options.secret);
  }

  /**
   * Validates the webhook signature and parses the incoming payload into a strongly-typed `WebhookEvent`.
   * Throws a `ValidationError` if the signature is invalid or if the JSON cannot be parsed.
   */
  constructEvent<T = Record<string, unknown>>(options: VerifyWebhookSignatureOptions): WebhookEvent<T> {
    const isValid = this.verifySignature(options);
    if (!isValid) {
      throw new ValidationError({
        message: 'Invalid webhook signature: signature does not match payload with provided secret',
      });
    }

    const payloadString =
      typeof options.payload === 'string'
        ? options.payload
        : Buffer.from(options.payload).toString('utf8');

    try {
      return JSON.parse(payloadString) as WebhookEvent<T>;
    } catch {
      throw new ValidationError({
        message: 'Invalid webhook payload: payload is not valid JSON',
      });
    }
  }
}
