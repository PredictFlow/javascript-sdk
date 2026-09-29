import { PredictFlow, type Store, type ImportResult } from '@predictflow/sdk';

async function main() {
  const predictFlow = new PredictFlow({
    apiKey: process.env.PREDICTFLOW_API_KEY || 'pk_live_6866099dd58c1112d8ce5579c1e3586f07160171cf20718553eb4eb5ff82a30a',
    baseUrl: process.env.PREDICTFLOW_BASE_URL || 'http://localhost:8000/api/v1',
  });

  console.log('=== PredictFlow Store CSV Import Lifecycle ===\n');

  // STEP 1: Create a dedicated manual store for CSV import
  console.log('1. Creating a new store for CSV imports...');
  const store: Store = await predictFlow.stores.create({
    name: 'import-demo-store',
    platform: 'manual',
  });
  console.log(`✅ Store created: "${store.name}" (ID: ${store.id})\n`);

  const storeId = store.id;

  // STEP 2: Prepare sample Products CSV
  console.log('2. Preparing sample Products CSV data...');
  const sampleProductsCsv = `sku,name,price,stock_quantity,cogs,shipping_cost
DEMO-TSHIRT-BLK,Classic Black T-Shirt,29.99,100,10.00,3.50
DEMO-HOODIE-GRY,Comfort Grey Hoodie,59.99,45,22.00,5.00
DEMO-CAP-NVY,Navy Snapback Cap,19.99,8,6.00,2.00
DEMO-MUG-WHT,Ceramic Coffee Mug,14.99,0,3.50,4.00`;

  // STEP 3: Import Products CSV
  console.log('3. Uploading and importing Products CSV...');
  const productImportResult: ImportResult = await predictFlow.stores.importProductsCsv(storeId, sampleProductsCsv);
  console.log(`✅ Products Import Completed:`);
  console.log(`   - Created: ${productImportResult.created}`);
  console.log(`   - Updated: ${productImportResult.updated}`);
  console.log(`   - Errors:  ${productImportResult.errors.length}\n`);

  // STEP 4: Prepare sample Orders CSV
  console.log('4. Preparing sample Orders CSV data...');
  const today = new Date().toISOString().split('T')[0];
  const sampleOrdersCsv = `order_number,order_date,sku,product_name,quantity,unit_price,currency
ORD-1001,${today},DEMO-TSHIRT-BLK,Classic Black T-Shirt,2,29.99,USD
ORD-1002,${today},DEMO-HOODIE-GRY,Comfort Grey Hoodie,1,59.99,USD
ORD-1003,${today},DEMO-CAP-NVY,Navy Snapback Cap,3,19.99,USD`;

  // STEP 5: Import Orders CSV
  console.log('5. Uploading and importing Orders CSV...');
  const orderImportResult: ImportResult = await predictFlow.stores.importOrdersCsv(storeId, sampleOrdersCsv);
  console.log(`✅ Orders Import Completed:`);
  console.log(`   - Created: ${orderImportResult.created}`);
  console.log(`   - Updated: ${orderImportResult.updated}`);
  console.log(`   - Errors:  ${orderImportResult.errors.length}\n`);

  // STEP 6: Verify imported products in catalog
  console.log('6. Verifying products in store catalog...');
  const productList = await predictFlow.products.list({ store_id: storeId });
  console.log(`✅ Total Products in Store: ${productList.total}`);
  for (const item of productList.items) {
    console.log(`   - [${item.sku}] ${item.name} | Price: $${item.price} | Stock: ${item.stock_quantity ?? 0} | Status: ${item.status}`);
  }
  console.log('');

  // STEP 7: Check store inventory health
  console.log('7. Verifying inventory health for imported store...');
  const health = await predictFlow.products.getInventoryHealth(storeId);
  console.log(`✅ Inventory Health:`);
  console.log(`   - Healthy:     ${health.healthy}`);
  console.log(`   - Low Stock:   ${health.low_stock}`);
  console.log(`   - Out of Stock: ${health.out_of_stock}\n`);

  console.log('🎉 Store CSV import lifecycle completed successfully!');
}

main().catch((err) => {
  console.error('❌ CSV Import Error:', err);
});
