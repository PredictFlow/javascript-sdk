import { PredictFlow } from '@predictflow/sdk';

async function main() {
  const predictFlow = new PredictFlow({
    apiKey: process.env.PREDICTFLOW_API_KEY || 'pk_live_6866099dd58c1112d8ce5579c1e3586f07160171cf20718553eb4eb5ff82a30a',
    baseUrl: process.env.PREDICTFLOW_BASE_URL || 'http://localhost:8000/api/v1',
  });

  const stores = await predictFlow.stores.list();
  if (stores.length === 0 || !stores[0]) return;
  const store = stores[0];

  const products = await predictFlow.products.list({ store_id: store.id, limit: 1 });
  if (products.items.length === 0 || !products.items[0]) return;
  const product = products.items[0];

  // 1. Analyze price elasticity
  try {
    const elasticity = await predictFlow.pricing.getElasticity(product.id);
    console.log('Price Elasticity Analysis:');
    console.log(` - Elasticity: ${elasticity.elasticity}`);
    console.log(` - Interpretation: ${elasticity.interpretation}`);
    console.log(` - Quality: ${elasticity.data_quality}`);
  } catch (err: any) {
    console.log(`ℹ️ Price Elasticity Gate: ${err.message}`);
  }

  // 2. Recommend optimal price
  const opt = await predictFlow.pricing.optimize(product.id, { strategy: 'maximize_revenue' });
  console.log('\nPrice Optimization:');
  console.log(` - Current Price: $${opt.current_price}`);
  console.log(` - Recommended Price: $${opt.recommended_price} (${opt.price_change_pct > 0 ? '+' : ''}${opt.price_change_pct}%)`);
  console.log(` - Expected Revenue Change: ${opt.expected_revenue_change_pct > 0 ? '+' : ''}${opt.expected_revenue_change_pct}%`);

  // 3. Simulate what happens if price is adjusted to $44.99
  const simulation = await predictFlow.pricing.simulate(product.id, {
    new_price: 44.99,
  });
  console.log('\nPrice Simulation:');
  console.log(` - Simulated Price: $${simulation.new_price}`);
  console.log(` - Projected Volume Shift: ${simulation.expected_volume_change_pct}%`);
  console.log(` - Projected Revenue Shift: ${simulation.expected_revenue_change_pct}%`);
  console.log(` - Recommendation Note: "${simulation.recommendation}"`);
}

main().catch(console.error);
