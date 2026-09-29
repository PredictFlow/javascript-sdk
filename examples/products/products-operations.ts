import {
  PredictFlow,
  type Product,
  type ProductListResponse,
  type InventoryHealthResponse,
  type LowStockResponse,
  type ABCAnalysisResponse,
  type MarginResponse,
} from '@predictflow/sdk';

async function main() {
  const predictFlow = new PredictFlow({
    apiKey: process.env.PREDICTFLOW_API_KEY || 'pk_live_6866099dd58c1112d8ce5579c1e3586f07160171cf20718553eb4eb5ff82a30a',
    baseUrl: process.env.PREDICTFLOW_BASE_URL || 'http://localhost:8000/api/v1',
  });

  console.log('=== PredictFlow Products & Inventory Operations ===\n');

  // STEP 1: Find a store with products or import sample products
  const stores = await predictFlow.stores.list();
  if (stores.length === 0) {
    console.log('No stores found. Please run stores example first.');
    return;
  }

  // Use the first store that has products, or import into the first store
  let targetStore = stores[0];
  if (!targetStore) {
    console.log('No stores found. Please run stores example first.');
    return;
  }
  let productList: ProductListResponse = await predictFlow.products.list({ store_id: targetStore.id });

  if (productList.items.length === 0) {
    console.log(`Store "${targetStore.name}" has no products. Importing sample products...`);
    const sampleCsv = `sku,name,price,stock_quantity,cogs,shipping_cost
PROD-JACKET-BLK,Waterproof Winter Jacket,129.99,35,45.00,8.00
PROD-JEANS-BLU,Slim Fit Denim Jeans,69.99,12,24.00,4.50
PROD-SNEAKER-WHT,Canvas Low Sneakers,49.99,4,18.00,5.00
PROD-TEE-WHT,Classic White T-Shirt,24.99,0,8.00,2.50
PROD-BELT-BRN,Leather Dress Belt,34.99,80,12.00,3.00`;
    await predictFlow.stores.importProductsCsv(targetStore.id, sampleCsv);
    productList = await predictFlow.products.list({ store_id: targetStore.id });
  }

  console.log(`Using Store: "${targetStore.name}" (ID: ${targetStore.id})\n`);

  // STEP 2: List products with search, pagination & sorting
  console.log('1. Listing products in store:');
  console.log(`   Found ${productList.total} total products:`);
  for (const p of productList.items) {
    console.log(`   - [${p.sku}] ${p.name}`);
    console.log(`     Price: $${p.price} | Stock: ${p.stock_quantity ?? 'N/A'} | Status: ${p.status} | ABC: ${p.abc_category ?? 'N/A'}`);
  }
  console.log('');

  const targetProduct = productList.items[0];
  if (!targetProduct) {
    console.log('No products found in store.');
    return;
  }
  const productId = targetProduct.id;

  // STEP 3: Get single product details by ID
  console.log(`2. Fetching details for Product "${targetProduct.name}" (ID: ${productId})...`);
  const productDetails: Product = await predictFlow.products.get(productId);
  console.log(`   SKU:              ${productDetails.sku}`);
  console.log(`   Name:             ${productDetails.name}`);
  console.log(`   Price:            $${productDetails.price}`);
  console.log(`   Stock Quantity:   ${productDetails.stock_quantity ?? 0}`);
  console.log(`   Tracks Inventory: ${productDetails.tracks_inventory}`);
  console.log(`   Created At:       ${productDetails.created_at}\n`);

  // STEP 4: Update product cost & calculate margin
  console.log(`3. Updating cost price (COGS & shipping) for "${productDetails.name}"...`);
  await predictFlow.products.updateCost(productId, {
    cogs: 20.0,
    shipping_cost: 3.5,
    other_fees: 1.5,
  });
  console.log(`✅ Product cost updated!`);

  console.log(`   Fetching profit margin analysis...`);
  const margin: MarginResponse = await predictFlow.products.getMargin(productId);
  console.log(`   Selling Price:        $${margin.price}`);
  console.log(`   COGS:                 $${margin.cogs ?? 0}`);
  console.log(`   Shipping Cost:        $${margin.shipping_cost ?? 0}`);
  console.log(`   Landed Cost:          $${margin.landed_cost ?? 0}`);
  console.log(`   Contribution Margin:  $${margin.contribution_margin ?? 0} (${margin.contribution_margin_pct ?? 0}%)\n`);

  // STEP 5: Inventory health overview
  console.log('4. Fetching store inventory health breakdown...');
  const health: InventoryHealthResponse = await predictFlow.products.getInventoryHealth(targetStore.id);
  console.log(`   Total Products:  ${health.total}`);
  console.log(`   Healthy:         ${health.healthy} (${health.healthy_pct}%)`);
  console.log(`   Low Stock:       ${health.low_stock} (${health.low_stock_pct}%)`);
  console.log(`   Out of Stock:    ${health.out_of_stock} (${health.out_of_stock_pct}%)`);
  console.log(`   Overstock:       ${health.overstock} (${health.overstock_pct}%)\n`);

  // STEP 6: Low-stock products list
  console.log('5. Fetching low-stock products (threshold <= 15)...');
  const lowStock: LowStockResponse = await predictFlow.products.listLowStock(targetStore.id, { threshold: 15 });
  console.log(`   Found ${lowStock.items.length} low-stock products:`);
  for (const item of lowStock.items) {
    console.log(`   - [${item.sku}] ${item.name}: ${item.stock_quantity ?? 0} units left`);
  }
  console.log('');

  // STEP 7: ABC Revenue Analysis
  console.log('6. Fetching ABC Revenue Analysis (80/15/5 revenue classification)...');
  const abc: ABCAnalysisResponse = await predictFlow.products.getAbcAnalysis(targetStore.id, { days: 90 });
  console.log(`   Period: ${abc.period_days} days | Total Analyzed Revenue: $${abc.total_revenue}`);
  console.log(`   Items Analyzed: ${abc.items.length}`);
  for (const item of abc.items.slice(0, 5)) {
    const sharePct = (item.revenue_share * 100).toFixed(1);
    console.log(`   - [Class ${item.category}] [${item.sku}] ${item.product_name} -> Revenue: $${item.revenue} (${sharePct}%)`);
  }
  console.log('');

  // STEP 8: Top Sellers
  console.log('7. Fetching Top Selling Products...');
  const topSellers = await predictFlow.products.getTopSellers(targetStore.id, { days: 30, limit: 5 });
  console.log(`   Top Sellers found (${topSellers.items.length}):`);
  for (const seller of topSellers.items) {
    console.log(`   - [${seller.sku}] ${seller.product_name} | Units Sold: ${seller.units_sold} | Revenue: $${seller.revenue}`);
  }
  console.log('');

  // STEP 9: Inventory level history snapshots
  console.log(`8. Fetching historical inventory snapshots for "${productDetails.name}"...`);
  const history = await predictFlow.products.getInventoryHistory(productId, { days: 30 });
  console.log(`   Snapshots recorded: ${history.length}\n`);

  console.log('🎉 All Products operations executed successfully!');
}

main().catch((err) => {
  console.error('❌ Products Operations Error:', err);
});
