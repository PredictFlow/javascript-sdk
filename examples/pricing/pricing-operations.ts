import {
  PredictFlow,
  type OptimizeResponse,
  type SimulateResponse,
  type BatchOptimizeItem,
  type CompetitorPrice,
  type RepriceSuggestionResponse,
} from '@predictflow/sdk';

async function main() {
  const predictFlow = new PredictFlow({
    apiKey: process.env.PREDICTFLOW_API_KEY || 'pk_live_6866099dd58c1112d8ce5579c1e3586f07160171cf20718553eb4eb5ff82a30a',
    baseUrl: process.env.PREDICTFLOW_BASE_URL || 'http://localhost:8000/api/v1',
  });

  console.log('=== PredictFlow Pricing & Revenue Optimization ===\n');

  // STEP 1: Find a store & product to optimize
  const stores = await predictFlow.stores.list();
  if (stores.length === 0) {
    console.log('No stores found. Please run stores example first.');
    return;
  }

  const targetStore = stores[0];
  if (!targetStore) {
    console.log('No stores found. Please run stores example first.');
    return;
  }
  console.log(`Target Store: "${targetStore.name}" (ID: ${targetStore.id})`);

  const productsResponse = await predictFlow.products.list({ store_id: targetStore.id, limit: 5 });
  const product = productsResponse.items[0];
  if (!product) {
    console.log('No products found in target store.');
    return;
  }
  console.log(`Selected Product: "${product.name}" (${product.sku || 'No SKU'}) - Price: $${product.price}\n`);

  // STEP 2: Price Elasticity Estimation
  console.log('1. Evaluating Historical Price Elasticity of Demand...');
  try {
    const elasticity = await predictFlow.pricing.getElasticity(product.id, { lookback_days: 180 });
    console.log(`✅ Elasticity Result:`);
    console.log(`   - Estimated Elasticity:  ${elasticity.elasticity}`);
    console.log(`   - Interpretation:        ${elasticity.interpretation}`);
    console.log(`   - Elasticity Type:       ${elasticity.elasticity_type}`);
    console.log(`   - Observations:          ${elasticity.n_observations} across ${elasticity.n_price_points} price points`);
    console.log(`   - Data Quality:          ${elasticity.data_quality}\n`);
  } catch (err: any) {
    console.log(`ℹ️ Price Elasticity Gate: ${err.message || 'Insufficient price history to compute pure historical elasticity'}\n`);
  }

  // STEP 3: Single Product Price Optimization
  console.log('2. Computing Optimal Price Recommendation (Strategy: maximize_revenue)...');
  const revenueOpt: OptimizeResponse = await predictFlow.pricing.optimize(product.id, {
    strategy: 'maximize_revenue',
  });

  console.log(`✅ Revenue Optimization:`);
  console.log(`   - Current Price:         $${revenueOpt.current_price}`);
  console.log(`   - Recommended Price:     $${revenueOpt.recommended_price} (${revenueOpt.price_change_pct > 0 ? '+' : ''}${revenueOpt.price_change_pct}%)`);
  console.log(`   - Expected Volume Shift: ${revenueOpt.expected_volume_change_pct > 0 ? '+' : ''}${revenueOpt.expected_volume_change_pct}%`);
  console.log(`   - Expected Rev Shift:    ${revenueOpt.expected_revenue_change_pct > 0 ? '+' : ''}${revenueOpt.expected_revenue_change_pct}%`);
  console.log(`   - Confidence:            ${revenueOpt.elasticity_confidence}\n`);

  console.log('3. Computing Optimal Price with Profit Strategy & Cost Override ($45.00)...');
  const profitOpt: OptimizeResponse = await predictFlow.pricing.optimize(product.id, {
    strategy: 'maximize_profit',
    cost_override: 45.0,
  });

  console.log(`✅ Profit Optimization:`);
  console.log(`   - Strategy:              ${profitOpt.strategy}`);
  console.log(`   - Recommended Price:     $${profitOpt.recommended_price} (${profitOpt.price_change_pct > 0 ? '+' : ''}${profitOpt.price_change_pct}%)`);
  console.log(`   - Current Margin:        ${profitOpt.current_margin_pct}% -> New Margin: ${profitOpt.new_margin_pct}%`);
  console.log(`   - Expected Profit Shift: ${profitOpt.expected_profit_change_pct ? (profitOpt.expected_profit_change_pct > 0 ? '+' : '') + profitOpt.expected_profit_change_pct + '%' : 'N/A'}\n`);

  // STEP 4: Hypothetical Price Simulation ("What if I price at $119.99?")
  const testNewPrice = 119.99;
  console.log(`4. Simulating Hypothetical Price Change to $${testNewPrice}...`);
  const simulation: SimulateResponse = await predictFlow.pricing.simulate(product.id, {
    new_price: testNewPrice,
    cost_override: 45.0,
  });

  console.log(`✅ Simulation Outcomes:`);
  console.log(`   - Proposed Price:        $${simulation.new_price} (${simulation.price_change_pct > 0 ? '+' : ''}${simulation.price_change_pct}%)`);
  console.log(`   - Projected Volume:      ${simulation.expected_volume_change_pct > 0 ? '+' : ''}${simulation.expected_volume_change_pct}%`);
  console.log(`   - Projected Revenue:     ${simulation.expected_revenue_change_pct > 0 ? '+' : ''}${simulation.expected_revenue_change_pct}%`);
  console.log(`   - Projected Profit:      ${simulation.expected_profit_change_pct ? (simulation.expected_profit_change_pct > 0 ? '+' : '') + simulation.expected_profit_change_pct + '%' : 'N/A'}`);
  console.log(`   - Recommendation Note:   "${simulation.recommendation}"\n`);

  // STEP 5: Store-wide Batch Optimization
  console.log('5. Running Store-wide Batch Optimization across all products...');
  const batchResults: BatchOptimizeItem[] = await predictFlow.pricing.batchOptimize(targetStore.id, {
    strategy: 'maximize_revenue',
    limit: 10,
  });

  console.log(`✅ Batch Optimization Generated ${batchResults.length} recommendations:`);
  for (const item of batchResults.slice(0, 5)) {
    console.log(`   - [${item.product_sku}] ${item.product_name}: $${item.current_price} -> $${item.recommended_price} (${item.price_change_pct > 0 ? '+' : ''}${item.price_change_pct}%) | Expected Rev: ${item.expected_revenue_change_pct > 0 ? '+' : ''}${item.expected_revenue_change_pct}%`);
  }
  console.log('');

  // STEP 6: Competitor Price Tracking & Automated Repricing
  console.log('6. Adding Tracked Competitor Price...');
  const competitorEntry: CompetitorPrice = await predictFlow.pricing.addCompetitorPrice(product.id, {
    competitor_name: 'Apex Athletics Global',
    competitor_url: 'https://competitor.example.com/shoes-apex',
    price: 89.99,
    currency: 'USD',
  });
  console.log(`✅ Added Competitor Price (ID: ${competitorEntry.id}): $${competitorEntry.price} from "${competitorEntry.competitor_name}"\n`);

  console.log('7. Listing Tracked Competitor Prices for Product...');
  const trackedPrices = await predictFlow.pricing.listCompetitorPrices(product.id);
  console.log(`✅ Active Tracked Competitors (${trackedPrices.length}):`);
  for (const cp of trackedPrices) {
    console.log(`   - ${cp.competitor_name}: $${cp.price} (Tracked: ${cp.created_at})`);
  }
  console.log('');

  console.log('8. Generating Smart Reprice Suggestion based on Competitor Market...');
  const repriceSuggestion: RepriceSuggestionResponse = await predictFlow.pricing.getRepriceSuggestion(product.id);
  console.log(`✅ Reprice Suggestion:`);
  console.log(`   - Current Price:         $${repriceSuggestion.current_price}`);
  console.log(`   - Competitor:            "${repriceSuggestion.competitor_name}" @ $${repriceSuggestion.competitor_price}`);
  console.log(`   - Suggested Reprice:     $${repriceSuggestion.suggested_price} (${repriceSuggestion.price_change_pct > 0 ? '+' : ''}${repriceSuggestion.price_change_pct}%)\n`);

  console.log('9. Cleaning up Tracked Competitor Price...');
  await predictFlow.pricing.deleteCompetitorPrice(product.id, competitorEntry.id);
  console.log(`✅ Competitor entry deleted successfully.\n`);

  console.log('🎉 All Pricing operations executed successfully!');
}

main().catch((err) => {
  console.error('❌ Pricing Operations Error:', err);
});
