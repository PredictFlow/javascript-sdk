import { PredictFlow } from '../dist/index.mjs';

async function main() {
  const apiKey = process.env.PREDICTFLOW_API_KEY || 'pk_live_6866099dd58c1112d8ce5579c1e3586f07160171cf20718553eb4eb5ff82a30a';
  const baseUrl = process.env.PREDICTFLOW_BASE_URL || 'http://localhost:8000/api/v1';

  const predictFlow = new PredictFlow({
    apiKey,
    baseUrl,
  });

  console.log('Fetching connected stores from PredictFlow backend...\n');
  const stores = await predictFlow.stores.list();

  if (stores.length === 0) {
    console.log('No stores found for this account.');
    return;
  }

  console.log(`Found ${stores.length} store(s):\n`);
  for (const [index, store] of stores.entries()) {
    console.log(`[Store #${index + 1}]`);
    console.log(`  ID:       ${store.id}`);
    console.log(`  Name:     ${store.name}`);
    console.log(`  Platform: ${store.platform}`);
    console.log(`  Status:   ${store.status}`);
    console.log(`  URL:      ${store.store_url || 'N/A'}`);
    console.log(`  Created:  ${store.created_at}`);
    console.log('--------------------------------------------------');
  }
}

main().catch(console.error);
