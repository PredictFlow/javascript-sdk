import { PredictFlow, ValidationError, computeHmacSha256 } from '@predictflow/sdk';

/**
 * Example webhook listener for Express / Node.js
 */
function handleIncomingWebhook(rawBody: string, signatureHeader: string) {
  const predictFlow = new PredictFlow();
  const webhookSecret = process.env.PREDICTFLOW_WEBHOOK_SECRET || 'whsec_your_secret';

  try {
    // 1. Verify signature and construct typed event
    const event = predictFlow.webhooks.constructEvent({
      payload: rawBody,
      signature: signatureHeader,
      secret: webhookSecret,
    });

    console.log(`Received verified webhook event: ${event.event} for store ${event.store_id}`);

    // 2. Handle specific event types with full type-safety
    switch (event.event) {
      case 'inventory.low_stock':
        console.log('ALERT: Low stock detected on item:', event.data);
        break;

      case 'prediction.completed':
        console.log('Forecast generation completed:', event.data);
        break;

      case 'store.sync_completed':
        console.log('Store catalog sync finished successfully');
        break;

      default:
        console.log(`Unhandled event type: ${event.event}`);
    }

    return { received: true };
  } catch (err) {
    if (err instanceof ValidationError) {
      console.error('Webhook security verification failed:', err.message);
      return { error: 'Invalid signature', status: 400 };
    }
    console.error('Server error processing webhook:', err);
    return { error: 'Internal error', status: 500 };
  }
}

// Simulated execution with valid signature
const secret = 'whsec_demo_123';
const mockPayload = JSON.stringify({
  id: 'evt_demo_99',
  event: 'inventory.low_stock',
  store_id: 'store_123',
  timestamp: new Date().toISOString(),
  data: { sku: 'SHIRT-BLU-L', stock_left: 3 },
});

const validSignature = computeHmacSha256(mockPayload, secret, 'hex');

process.env.PREDICTFLOW_WEBHOOK_SECRET = secret;
handleIncomingWebhook(mockPayload, validSignature);
