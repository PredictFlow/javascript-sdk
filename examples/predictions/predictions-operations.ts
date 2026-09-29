import {
  PredictFlow,
  type Prediction,
  type SimulationResponse,
  type StockoutResponse,
  type InventoryRecommendationResponse,
  type PolicyOptimizationResponse,
} from '@predictflow/sdk';

async function main() {
  const predictFlow = new PredictFlow({
    apiKey: process.env.PREDICTFLOW_API_KEY || 'pk_live_6866099dd58c1112d8ce5579c1e3586f07160171cf20718553eb4eb5ff82a30a',
    baseUrl: process.env.PREDICTFLOW_BASE_URL || 'http://localhost:8000/api/v1',
  });

  console.log('=== PredictFlow AI Demand Predictions & Simulations ===\n');

  // STEP 1: Find a product with sales/inventory history
  const stores = await predictFlow.stores.list();
  if (stores.length === 0) {
    console.log('No stores found.');
    return;
  }

  const store = stores[0];
  if (!store) {
    console.log('No stores found.');
    return;
  }
  const products = await predictFlow.products.list({ store_id: store.id });

  const targetProduct = products.items[0];
  if (!targetProduct) {
    console.log('No products found in store.');
    return;
  }
  console.log(`Using Product: "${targetProduct.name}" (SKU: ${targetProduct.sku}, ID: ${targetProduct.id})\n`);

  // STEP 2: Generate a 30-day demand forecast (Prophet / ML)
  console.log('1. Generating 30-day Prophet demand forecast...');
  let prediction: Prediction;
  try {
    prediction = await predictFlow.predictions.forecastProduct(targetProduct.id, {
      horizon_days: 30,
      model: 'prophet',
    });
    console.log(`✅ Forecast generated successfully!`);
    console.log(`   Prediction ID:  ${prediction.id}`);
    console.log(`   Model:          ${prediction.model_name}`);
    console.log(`   Horizon:        ${prediction.horizon_days} days`);
    console.log(`   Generated At:   ${prediction.generated_at}\n`);
  } catch (err: any) {
    console.log(`ℹ️  Forecast generation note: ${err.message}`);
    // If not enough history on first item, check forecast history
    const pastForecasts = await predictFlow.products.getForecastHistory(targetProduct.id);
    const firstPast = pastForecasts[0];
    if (firstPast) {
      prediction = firstPast;
      console.log(`   Using existing prediction ID: ${prediction.id}\n`);
    } else {
      console.log('No predictions available to simulate.');
      return;
    }
  }

  const predictionId = prediction.id;

  // STEP 3: Monte Carlo Demand Simulation
  console.log('2. Running Monte Carlo demand simulation (2,000 runs)...');
  const sim: SimulationResponse = await predictFlow.predictions.simulate(predictionId, {
    n_simulations: 2000,
    distribution: 'negative_binomial',
  });
  console.log(`✅ Simulation completed!`);
  console.log(`   Simulations:         ${sim.n_simulations} iterations`);
  console.log(`   Distribution:        ${sim.distribution}`);
  console.log(`   Projected Mean Demand: ${sim.total_demand.mean.toFixed(1)} units`);
  console.log(`   Demand Std Deviation:  ${sim.total_demand.std.toFixed(1)} units\n`);

  // STEP 4: Stockout Risk Simulation
  console.log('3. Simulating stockout probability and days until stockout...');
  const stockout: StockoutResponse = await predictFlow.predictions.simulateStockout(predictionId, {
    current_stock: targetProduct.stock_quantity ?? 50,
  });
  console.log(`✅ Stockout simulation completed!`);
  console.log(`   Current Stock Tested:        ${stockout.current_stock} units`);
  console.log(`   Total Stockout Probability:   ${(stockout.total_stockout_probability * 100).toFixed(1)}%`);
  console.log(`   Expected Days Until Stockout: ${stockout.expected_days_until_stockout ?? 'No risk in horizon'} days\n`);

  // STEP 5: Intelligent Inventory Reorder Recommendation
  console.log('4. Calculating optimal inventory reorder recommendation...');
  const recommendation: InventoryRecommendationResponse = await predictFlow.predictions.getInventoryRecommendation(
    predictionId,
    {
      current_stock: targetProduct.stock_quantity ?? 50,
      lead_time_days: 7,
      target_service_level: 0.95,
    }
  );
  console.log(`✅ Inventory recommendation generated!`);
  console.log(`   Optimal Reorder Point:  ${recommendation.recommendation.reorder_point} units`);
  console.log(`   Recommended Order Qty:  ${recommendation.recommendation.reorder_quantity} units`);
  console.log(`   Calculated Safety Stock: ${recommendation.recommendation.safety_stock} units`);
  console.log(`   Should Reorder Now?:    ${recommendation.action.should_reorder_now ? '🚨 YES' : '✅ NO'}`);
  console.log(`   Urgency:                ${recommendation.action.urgency.toUpperCase()}\n`);

  // STEP 6: Policy Optimization
  console.log('5. Optimizing inventory holding policy (Target: 95% service level)...');
  const policy: PolicyOptimizationResponse = await predictFlow.predictions.optimizePolicy(predictionId, {
    lead_time_days: 7,
    target_service_level: 0.95,
  });
  console.log(`✅ Policy optimization complete!`);
  console.log(`   Optimal Reorder Point:    ${policy.optimal_reorder_point} units`);
  console.log(`   Optimal Order Quantity:   ${policy.optimal_reorder_quantity} units`);
  console.log(`   Expected Service Level:   ${(policy.expected_service_level * 100).toFixed(1)}%`);
  console.log(`   Meets Service Level:      ${policy.meets_target_service_level ? 'YES' : 'NO'}\n`);

  console.log('🎉 All Prediction & Simulation operations executed successfully!');
}

main().catch((err) => {
  console.error('❌ Prediction Operations Error:', err);
});
