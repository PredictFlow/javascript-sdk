import { PredictFlow } from '@predictflow/sdk';

async function main() {
  // 1. Initialize client with API key and baseUrl
  const predictFlow = new PredictFlow({
    apiKey: process.env.PREDICTFLOW_API_KEY || 'pk_live_6866099dd58c1112d8ce5579c1e3586f07160171cf20718553eb4eb5ff82a30a',
    baseUrl: process.env.PREDICTFLOW_BASE_URL || 'http://localhost:8000/api/v1',
  });

  // 2. Health check
  const health = await predictFlow.health();
  console.log('API Status:', health.status);

  // 3. List connected stores
  const stores = await predictFlow.stores.list();
  console.log(`Connected Stores (${stores.length}):`);
  for (const store of stores) {
    console.log(` - [${store.platform}] ${store.name} (${store.store_url || 'manual'}) -> Status: ${store.status}`);
  }
}

main().catch(console.error);
