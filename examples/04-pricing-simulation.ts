import { PredictFlow } from '../dist/index.mjs';

async function main() {
  const predictFlow = new PredictFlow();
  const productId = 'prod_12345';
  const storeId = 'store_abc123';

  // 1. Analyze price elasticity
  const elasticity = await predictFlow.pricing.getElasticity(productId);
  console.log('Price Elasticity Analysis:');
  console.log(` - Current Price: $${elasticity.current_price}`);
  console.log(` - Elasticity Coefficient: ${elasticity.elasticity_coefficient}`);
  console.log(` - Category: ${elasticity.elasticity_category}`);
  console.log(` - Recommended Optimal Price: $${elasticity.optimal_price}`);

  // 2. Simulate what happens if price is adjusted to $44.99
  const simulation = await predictFlow.pricing.simulate(productId, {
    test_price: 44.99,
  });
  console.log('\nPrice Simulation:');
  console.log(` - Simulated Price: $${simulation.simulated_price}`);
  console.log(` - Projected Daily Units: ${simulation.predicted_daily_units}`);
  console.log(` - Projected Monthly Revenue: $${simulation.predicted_monthly_revenue}`);
  console.log(` - Demand Impact: ${simulation.demand_impact_percentage > 0 ? '+' : ''}${simulation.demand_impact_percentage}%`);

  // 3. What-if scenario planning
  const scenario = await predictFlow.scenarios.create(storeId, {
    name: 'Summer Sale 15% Price Reduction',
    parameters: {
      price_change_pct: -15,
      marketing_budget_change_pct: 25,
    },
  });
  console.log(`\nCreated Simulation Scenario: ${scenario.name} (ID: ${scenario.id})`);
}

main().catch(console.error);
