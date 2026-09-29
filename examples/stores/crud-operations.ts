import { PredictFlow, type Store } from '@predictflow/sdk';

async function main() {
  const predictFlow = new PredictFlow({
    apiKey: process.env.PREDICTFLOW_API_KEY || 'pk_live_6866099dd58c1112d8ce5579c1e3586f07160171cf20718553eb4eb5ff82a30a',
    baseUrl: process.env.PREDICTFLOW_BASE_URL || 'http://localhost:8000/api/v1',
  });

  console.log('=== PredictFlow Store CRUD Operations ===\n');

  // STEP 1: Create a store named 's1'
  console.log('1. Creating a new store named "s1"...');
  const createdStore: Store = await predictFlow.stores.create({
    name: 's1',
    platform: 'manual',
  });
  console.log(`✅ Store Created successfully!`);
  console.log(`   ID:       ${createdStore.id}`);
  console.log(`   Name:     ${createdStore.name}`);
  console.log(`   Platform: ${createdStore.platform}`);
  console.log(`   Status:   ${createdStore.status}\n`);

  const storeId: string = createdStore.id;

  // STEP 2: Get details of store 's1'
  console.log(`2. Getting details for store ID: ${storeId}...`);
  const storeDetails: Store = await predictFlow.stores.get(storeId);
  console.log(`✅ Retrieved Store Details:`);
  console.log(`   Name:     ${storeDetails.name}`);
  console.log(`   Platform: ${storeDetails.platform}`);
  console.log(`   Created:  ${storeDetails.created_at}\n`);

  // STEP 3: Get all stores
  console.log('3. Fetching all connected stores...');
  const allStores: Store[] = await predictFlow.stores.list();
  console.log(`✅ Total Stores: ${allStores.length}`);
  for (const s of allStores) {
    const isNew = s.id === storeId ? ' (👉 just created)' : '';
    console.log(`   - [${s.platform}] ${s.name} (ID: ${s.id})${isNew}`);
  }
  console.log('');

  // STEP 4: Update store name to 's2'
  console.log(`4. Updating store name to "s2"...`);
  const updatedStore: Store = await predictFlow.stores.update(storeId, {
    name: 's2',
  });
  console.log(`✅ Store Updated!`);
  console.log(`   New Name: ${updatedStore.name}`);
  console.log(`   Updated:  ${updatedStore.updated_at}\n`);

  // STEP 5: Delete the store
  console.log(`5. Deleting store "${updatedStore.name}" (ID: ${storeId})...`);
  await predictFlow.stores.delete(storeId);
  console.log(`✅ Store deleted successfully!\n`);

  // STEP 6: Verify deletion by listing all stores again
  console.log('6. Verifying store list after deletion...');
  const remainingStores: Store[] = await predictFlow.stores.list();
  const exists: boolean = remainingStores.some((s: Store) => s.id === storeId);
  console.log(`✅ Store ${storeId} exists in list: ${exists ? 'YES (Error)' : 'NO (Confirmed Deleted)'}`);
  console.log(`   Remaining Stores Count: ${remainingStores.length}\n`);

  console.log('🎉 Store CRUD lifecycle completed successfully!');
}

main().catch((err) => {
  console.error('❌ Store CRUD Error:', err);
});
