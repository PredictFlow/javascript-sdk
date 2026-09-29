import {
  PredictFlow,
  computeHmacSha256,
} from '@predictflow/sdk';

async function main() {
  const predictFlow = new PredictFlow({
    apiKey: 'pk_live_test',
  });

  console.log('=== PredictFlow Webhook Verification & Crypto Engine ===\n');

  const webhookSecret = 'whsec_99f28a7e02b0c345118d09aa8e3714b1';

  // SCENARIO 1: Standard Hex HMAC Webhook Payload
  console.log('1. Testing Standard Hex HMAC-SHA256 Signature Verification...');
  const payload1 = JSON.stringify({
    id: 'evt_01928374a',
    event: 'inventory.low_stock',
    store_id: 'str_123',
    timestamp: new Date().toISOString(),
    data: {
      product_id: 'prd_456',
      sku: 'KEY-001',
      stock_quantity: 3,
      threshold: 5,
    },
  });

  const validHexSig = computeHmacSha256(payload1, webhookSecret, 'hex');
  console.log(`Generated Valid Signature (Hex): "${validHexSig}"`);

  const event1 = predictFlow.webhooks.constructEvent<{ product_id: string; sku: string; stock_quantity: number }>({
    payload: payload1,
    signature: validHexSig,
    secret: webhookSecret,
  });

  console.log(`✅ Webhook verified & constructed successfully:`);
  console.log(`   - Event Type:   ${event1.event}`);
  console.log(`   - Store ID:     ${event1.store_id}`);
  console.log(`   - Product SKU:  ${event1.data.sku}`);
  console.log(`   - Remaining:    ${event1.data.stock_quantity} units\n`);

  // SCENARIO 2: Base64 HMAC-SHA256 Signature
  console.log('2. Testing Base64 Encoded Signature Verification...');
  const validBase64Sig = computeHmacSha256(payload1, webhookSecret, 'base64');
  const isValidBase64 = predictFlow.webhooks.verifySignature({
    payload: payload1,
    signature: validBase64Sig,
    secret: webhookSecret,
  });
  console.log(`✅ Base64 Signature Valid: ${isValidBase64}\n`);

  // SCENARIO 3: Timestamped Header Format (`t=1700000000,v1=...`)
  console.log('3. Testing Timestamped Header (`t=...,v1=...`) Anti-Replay Format...');
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signedPayload = `${timestamp}.${payload1}`;
  const timestampedSigV1 = computeHmacSha256(signedPayload, webhookSecret, 'hex');
  const fullHeader = `t=${timestamp},v1=${timestampedSigV1}`;

  const isTimestampedValid = predictFlow.webhooks.verifySignature({
    payload: payload1,
    signature: fullHeader,
    secret: webhookSecret,
  });
  console.log(`✅ Timestamped Header ("${fullHeader.slice(0, 35)}..."): Valid = ${isTimestampedValid}\n`);

  // SCENARIO 4: Tampered Payload Attack Prevention
  console.log('4. Testing Tampered Payload Detection...');
  const tamperedPayload = payload1.replace('"stock_quantity":3', '"stock_quantity":999');
  try {
    predictFlow.webhooks.constructEvent({
      payload: tamperedPayload,
      signature: validHexSig,
      secret: webhookSecret,
    });
    console.error('❌ FAILED: Tampered payload was unexpectedly accepted!');
  } catch (err: any) {
    console.log(`✅ Tampered Payload successfully blocked with ValidationError: "${err.message}"\n`);
  }

  // SCENARIO 5: Invalid Secret Rejection
  console.log('5. Testing Wrong Webhook Secret Rejection...');
  const isWrongSecretValid = predictFlow.webhooks.verifySignature({
    payload: payload1,
    signature: validHexSig,
    secret: 'whsec_wrong_attacker_secret',
  });
  console.log(`✅ Wrong Secret Rejected: Valid = ${isWrongSecretValid}\n`);

  console.log('🎉 All Webhook & Crypto operations executed successfully!');
}

main().catch((err) => {
  console.error('❌ Webhook Operations Error:', err);
});
