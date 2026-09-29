# PredictFlow JavaScript & TypeScript SDK

[![npm version](https://img.shields.io/badge/npm-v0.1.0-blue.svg)](https://www.npmjs.com/package/@predictflow/sdk)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)]()

The official JavaScript and TypeScript SDK for [PredictFlow](https://predictflow.com) — an intelligent demand forecasting, inventory optimization, and e-commerce analytics platform.

---

## Features

- ⚡ **Zero Runtime Dependencies** — Ultra-lightweight, high-performance footprint.
- 🔒 **100% Type-Safe** — Complete TypeScript definitions generated from the official PredictFlow API.
- 🌐 **Universal Compatibility** — Works seamlessly in Node.js 18+, Next.js (Server & Edge), Browsers, Bun, and Cloudflare Workers.
- 🔁 **Automatic Retries & Backoff** — Built-in resilience for rate limits (429) and transient network errors.
- 🔐 **Webhook Verification** — Timing-safe HMAC-SHA256 signature verification for webhook event ingestion.
- 📦 **Dual ESM & CommonJS** — Native support for `import` and `require()`.

---

## Installation

```bash
# npm
npm install @predictflow/sdk

# pnpm
pnpm add @predictflow/sdk

# yarn
yarn add @predictflow/sdk

# bun
bun add @predictflow/sdk
```

---

## Quickstart

### 1. Initialize the Client

```typescript
import { PredictFlow } from '@predictflow/sdk';

// Initialize with API Key or let it read from process.env.PREDICTFLOW_API_KEY
const predictFlow = new PredictFlow({
  apiKey: process.env.PREDICTFLOW_API_KEY,
});

// Verify connectivity
const health = await predictFlow.health();
console.log('API Status:', health.status);
```

### 2. CommonJS (Node.js)

```javascript
const { PredictFlow } = require('@predictflow/sdk');

const predictFlow = new PredictFlow({
  apiKey: process.env.PREDICTFLOW_API_KEY,
});
```

---

## Core Guides & Usage

### 📊 Demand Forecasting & Predictions

```typescript
// 1. Generate a 30-day demand forecast for a product
const forecast = await predictFlow.predictions.forecastProduct('prod_123', {
  horizon_days: 30,
  include_confidence_intervals: true,
});

console.log(`Forecasted Units: ${forecast.forecast_data.total_forecasted_units}`);

// 2. Simulate stockout risk
const stockout = await predictFlow.predictions.simulateStockout(forecast.id, {
  lead_time_days: 7,
  safety_stock: 15,
});

console.log(`Days to Stockout: ${stockout.days_to_stockout} days`);

// 3. Get optimal inventory reorder quantity & reorder point
const recommendation = await predictFlow.predictions.getInventoryRecommendation(forecast.id);
console.log(`Optimal Reorder Point: ${recommendation.optimal_reorder_point} units`);
console.log(`Recommended Order Qty: ${recommendation.recommended_order_quantity} units`);
```

---

### 📦 Products & Inventory Health

```typescript
const storeId = 'store_abc123';

// List low stock products requiring immediate attention
const lowStock = await predictFlow.products.listLowStock(storeId);

// Get overall inventory health overview
const health = await predictFlow.products.getInventoryHealth(storeId);
console.log(`Dead Stock Items: ${health.dead_stock_count}`);
console.log(`Estimated Dead Stock Value: $${health.estimated_dead_stock_value}`);

// Get ABC Revenue Analysis (80/15/5 revenue drivers)
const abc = await predictFlow.products.getAbcAnalysis(storeId);
```

---

### 🏪 Stores & Catalog Sync

```typescript
// List all connected stores
const stores = await predictFlow.stores.list();

// Trigger a catalog sync for a store
const syncResult = await predictFlow.stores.triggerSync('store_abc123');
console.log('Sync triggered:', syncResult.message);
```

---

### 📈 Analytics & KPIs

```typescript
// Get dashboard KPIs and growth percentages
const kpis = await predictFlow.analytics.getKpis({
  period_days: 30,
  store_id: 'store_abc123',
});

console.log(`Current Revenue: $${kpis.current.total_revenue}`);
console.log(`Revenue Growth: ${kpis.growth.revenue_growth}%`);

// Get sales historical trend data points
const trend = await predictFlow.analytics.getTrend({ period_days: 30 });
```

---

### 🏷️ Pricing Elasticity & Simulations

```typescript
// Check price elasticity coefficient for a product
const elasticity = await predictFlow.pricing.getElasticity('prod_123');
console.log(`Category: ${elasticity.elasticity_category}`); // 'elastic' | 'inelastic'
console.log(`Suggested Optimal Price: $${elasticity.optimal_price}`);

// Simulate a hypothetical price change
const sim = await predictFlow.pricing.simulate('prod_123', { test_price: 49.99 });
console.log(`Projected Monthly Revenue: $${sim.predicted_monthly_revenue}`);
```

---

### 🔔 Webhooks & Signature Verification

Verify incoming webhooks securely with constant-time HMAC comparison:

```typescript
import { PredictFlow, ValidationError } from '@predictflow/sdk';

const predictFlow = new PredictFlow();

// Express / Next.js webhook handler
app.post('/api/webhook', (req, res) => {
  const signature = req.headers['x-predictflow-signature'];
  const secret = process.env.PREDICTFLOW_WEBHOOK_SECRET!;

  try {
    const event = predictFlow.webhooks.constructEvent({
      payload: req.body, // Raw body string or buffer
      signature,
      secret,
    });

    if (event.event === 'inventory.low_stock') {
      console.log('Low stock event received:', event.data);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).send('Invalid webhook signature');
    }
    res.status(500).send('Webhook error');
  }
});
```

---

## Error Handling

The SDK provides a typed error hierarchy for error handling:

```typescript
import {
  PredictFlow,
  AuthenticationError,
  NotFoundError,
  ValidationError,
  RateLimitError,
  PredictFlowError,
} from '@predictflow/sdk';

try {
  const forecast = await predictFlow.predictions.forecastProduct('prod_missing');
} catch (err) {
  if (err instanceof AuthenticationError) {
    console.error('Check your API Key credentials');
  } else if (err instanceof NotFoundError) {
    console.error('Product was not found');
  } else if (err instanceof RateLimitError) {
    console.warn(`Rate limited. Retry after ${err.retryAfterSeconds}s`);
  } else if (err instanceof ValidationError) {
    console.error('Invalid parameter payload:', err.details);
  } else if (err instanceof PredictFlowError) {
    console.error(`API Error [${err.status}]: ${err.message}`);
  }
}
```

---

## Client Options

```typescript
const predictFlow = new PredictFlow({
  // PredictFlow API Key (defaults to process.env.PREDICTFLOW_API_KEY)
  apiKey: 'pf_live_...',

  // Custom API Base URL (defaults to 'https://api.predictflow.com/v1')
  baseUrl: 'https://api.predictflow.com/v1',

  // Request timeout in milliseconds (defaults to 30000ms / 30s)
  timeoutMs: 15000,

  // Maximum retry attempts for rate limits & network errors (defaults to 2)
  maxRetries: 3,

  // Custom default headers to include with every request
  defaultHeaders: {
    'X-Custom-App': 'MyDashboard/1.0',
  },

  // Optional custom fetch implementation (useful for tests or edge runtimes)
  fetch: customFetch,
});
```

---

## Development & Testing

```bash
# Install dependencies
npm install

# Run Vitest test suite
npm test

# Build dual ESM/CJS bundles + TypeScript declarations
npm run build

# Run type check
npm run typecheck
```

---

## License

MIT © [PredictFlow](https://predictflow.com)
