import { PredictFlow } from '../dist/index.mjs';

async function main() {
  const predictFlow = new PredictFlow({
    apiKey: process.env.PREDICTFLOW_API_KEY || 'pk_live_6866099dd58c1112d8ce5579c1e3586f07160171cf20718553eb4eb5ff82a30a',
    baseUrl: process.env.PREDICTFLOW_BASE_URL || 'http://localhost:8000/api/v1',
  });

  const storeId = '0a071fdf-0ed5-4d6a-8339-3b6655f96ab6';

  // 1. Trigger catalog sync (for live Shopify/WooCommerce stores)
  try {
    console.log('Attempting store catalog sync...');
    const sync = await predictFlow.stores.triggerSync(storeId);
    console.log(`Sync Status: ${sync.message}`);
  } catch (err: any) {
    console.log(`ℹ️  Sync skipped (Manual/CSV store): ${err.message}`);
  }

  // 2. Fetch inventory health overview
  console.log('\nFetching inventory health...');
  const health = await predictFlow.products.getInventoryHealth(storeId);
  console.log('Inventory Health Summary:');
  console.log(` - Total Products:      ${health.total}`);
  console.log(` - Healthy Stock:       ${health.healthy} (${health.healthy_pct}%)`);
  console.log(` - Low Stock:           ${health.low_stock} (${health.low_stock_pct}%)`);
  console.log(` - Out of Stock:        ${health.out_of_stock} (${health.out_of_stock_pct}%)`);
  console.log(` - Overstock:           ${health.overstock} (${health.overstock_pct}%)`);

  // 3. List products requiring attention (low stock)
  console.log('\nFetching low-stock products...');
  const lowStock = await predictFlow.products.listLowStock(storeId, { threshold: 15 });
  console.log(`Low Stock Products found (${lowStock.items.length}):`);
  for (const item of lowStock.items) {
    console.log(` - [${item.sku}] ${item.name}: ${item.stock_quantity ?? 0} units left`);
  }

  // 4. View ABC Analysis breakdown
  console.log('\nFetching ABC revenue analysis...');
  const abc = await predictFlow.products.getAbcAnalysis(storeId, { days: 30 });
  console.log(`Total Revenue Analyzed: $${abc.total_revenue}`);
  console.log(`Products Analyzed: ${abc.items.length}`);
  const catA = abc.items.filter((p) => p.category === 'A');
  console.log(` - Category A (Top revenue drivers): ${catA.length} products`);
}

main().catch(console.error);
