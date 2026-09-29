import { PredictFlow } from '../dist/index.mjs';

async function main() {
  // 1. Initialize client with API key and optional local baseUrl
  const predictFlow = new PredictFlow({
    apiKey: process.env.PREDICTFLOW_API_KEY || 'pf_live_demo_key',
    baseUrl: process.env.PREDICTFLOW_BASE_URL || 'http://localhost:8000/api/v1',
  });

  // 2. Health check
  const health = await predictFlow.health();
  console.log('API Status:', health.status);

  // 3. List connected stores
  const stores = await predictFlow.stores.list();
  console.log(`Connected Stores (${stores.length}):`);
  for (const store of stores) {
    console.log(` - [${store.platform}] ${store.name} (${store.store_url}) -> Status: ${store.status}`);
  }
}

main().catch(console.error);
