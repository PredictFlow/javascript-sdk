/**
 * Webhook Types and Payload Schemas for PredictFlow SDK
 */

export type WebhookEventType =
  | 'prediction.created'
  | 'prediction.completed'
  | 'prediction.failed'
  | 'inventory.low_stock'
  | 'inventory.stockout_risk'
  | 'store.sync_started'
  | 'store.sync_completed'
  | 'store.sync_failed'
  | 'alert.triggered'
  | 'scenario.completed'
  | string;

export interface WebhookEvent<T = Record<string, unknown>> {
  id: string;
  event: WebhookEventType;
  store_id: string;
  timestamp: string;
  data: T;
}

export interface VerifyWebhookSignatureOptions {
  /**
   * The raw string or buffer of the incoming HTTP request body.
   */
  payload: string | Buffer | Uint8Array;

  /**
   * The signature header sent with the request (e.g. `x-predictflow-signature` or `x-wc-webhook-signature` or `x-shopify-hmac-sha256`).
   */
  signature: string;

  /**
   * The shared secret key configured for the webhook endpoint.
   */
  secret: string;

  /**
   * Maximum allowed age of the webhook in seconds (for replay attack prevention).
   * @default 300 (5 minutes)
   */
  toleranceSeconds?: number;
}
