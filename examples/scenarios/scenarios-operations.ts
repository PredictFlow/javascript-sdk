import {
  PredictFlow,
  type Scenario,
  type ScenarioResult,
  type ScenarioComparison,
} from '@predictflow/sdk';

async function main() {
  const predictFlow = new PredictFlow({
    apiKey: process.env.PREDICTFLOW_API_KEY || 'pk_live_6866099dd58c1112d8ce5579c1e3586f07160171cf20718553eb4eb5ff82a30a',
    baseUrl: process.env.PREDICTFLOW_BASE_URL || 'http://localhost:8000/api/v1',
  });

  console.log('=== PredictFlow Scenario Planning & What-If Simulation ===\n');

  // STEP 1: Find a store to attach scenarios to
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
  console.log(`Target Store: "${targetStore.name}" (ID: ${targetStore.id})\n`);

  // STEP 2: Create Scenario A: "Price Increase +15%"
  console.log('1. Creating Scenario A: "Q4 Price Hike +15%"...');
  const scenarioA: Scenario = await predictFlow.scenarios.create(targetStore.id, {
    name: 'Q4 Price Hike +15%',
    description: 'Evaluate impact of raising all catalog prices by 15% with zero marketing change',
    price_change_pct: 0.15,
    demand_shift_pct: 0.0,
  });
  console.log(`✅ Created Scenario A (ID: ${scenarioA.id}):`);
  console.log(`   - Name:             "${scenarioA.name}"`);
  console.log(`   - Price Change:     +${scenarioA.price_change_pct * 100}%`);
  console.log(`   - Demand Shift:     ${scenarioA.demand_shift_pct * 100}%\n`);

  // STEP 3: Create Scenario B: "Marketing Boost + Promotion (-10% price, +25% demand)"
  console.log('2. Creating Scenario B: "Black Friday Promo (-10% price, +25% demand shift)"...');
  const scenarioB: Scenario = await predictFlow.scenarios.create(targetStore.id, {
    name: 'Black Friday Promo',
    description: 'Evaluate heavy discounting coupled with marketing acquisition bump',
    price_change_pct: -0.10,
    demand_shift_pct: 0.25,
  });
  console.log(`✅ Created Scenario B (ID: ${scenarioB.id}):`);
  console.log(`   - Name:             "${scenarioB.name}"`);
  console.log(`   - Price Change:     ${scenarioB.price_change_pct * 100}%`);
  console.log(`   - Demand Shift:     +${scenarioB.demand_shift_pct * 100}%\n`);

  // STEP 4: List Scenarios for Store
  console.log('3. Listing all Scenarios for target store...');
  const allScenarios = await predictFlow.scenarios.list(targetStore.id);
  console.log(`✅ Total Scenarios in Store: ${allScenarios.length}`);
  for (const s of allScenarios) {
    console.log(`   - [${s.id}] "${s.name}" (Price: ${s.price_change_pct * 100}%, Demand: ${s.demand_shift_pct * 100}%)`);
  }
  console.log('');

  // STEP 5: Update Scenario A parameters
  console.log('4. Updating Scenario A description & adjusting price hike to +12%...');
  const updatedA: Scenario = await predictFlow.scenarios.update(scenarioA.id, {
    description: 'Adjusted Q4 conservative hike to 12%',
    price_change_pct: 0.12,
  });
  console.log(`✅ Updated Scenario A: Price Change now ${updatedA.price_change_pct * 100}% ("${updatedA.description}")\n`);

  // STEP 6: Execute Scenario A simulation
  console.log('5. Executing What-If Simulation for Scenario A...');
  const resultA: ScenarioResult = await predictFlow.scenarios.execute(scenarioA.id);
  console.log(`✅ Simulation Results for Scenario A ("${resultA.scenario_name}"):`);
  console.log(`   - Current Catalog Revenue:  $${resultA.total_current_revenue.toFixed(2)}`);
  console.log(`   - Projected New Revenue:    $${resultA.total_new_revenue.toFixed(2)} (${resultA.total_revenue_change_pct > 0 ? '+' : ''}${(resultA.total_revenue_change_pct * 100).toFixed(2)}%)`);
  if (resultA.total_new_profit !== null && resultA.total_current_profit !== null) {
    console.log(`   - Current Total Profit:     $${resultA.total_current_profit.toFixed(2)}`);
    console.log(`   - Projected Total Profit:   $${resultA.total_new_profit.toFixed(2)} (${resultA.total_profit_change_pct ? (resultA.total_profit_change_pct > 0 ? '+' : '') + (resultA.total_profit_change_pct * 100).toFixed(2) + '%' : 'N/A'})`);
  }
  console.log(`   - Products Simulated:       ${resultA.products.length}`);
  for (const p of resultA.products.slice(0, 3)) {
    console.log(`     * [${p.product_sku}] ${p.product_name}: $${p.current_price} -> $${p.new_price} | Rev: $${p.current_revenue.toFixed(2)} -> $${p.new_revenue.toFixed(2)} (${(p.revenue_change_pct * 100).toFixed(1)}%)`);
  }
  console.log('');

  // STEP 7: Clone Scenario
  console.log('6. Cloning Scenario A to create an experimental branch...');
  const clonedScenario: Scenario = await predictFlow.scenarios.clone(scenarioA.id, {
    name: 'Q4 Price Hike +12% (Clone Branch)',
  });
  console.log(`✅ Cloned Scenario (ID: ${clonedScenario.id}): "${clonedScenario.name}"\n`);

  // STEP 8: Compare Scenario A vs Scenario B Side-by-Side
  console.log('7. Comparing Scenario A vs Scenario B side-by-side...');
  const comparison: ScenarioComparison = await predictFlow.scenarios.compare(targetStore.id, {
    scenario_a_id: scenarioA.id,
    scenario_b_id: scenarioB.id,
  });

  console.log(`✅ Scenario Comparison:`);
  console.log(`   Scenario A: "${comparison.scenario_a.scenario_name}"`);
  console.log(`   - Projected Revenue:  $${comparison.scenario_a.total_new_revenue.toFixed(2)} (${(comparison.scenario_a.total_revenue_change_pct * 100).toFixed(2)}%)`);
  console.log(`   Scenario B: "${comparison.scenario_b.scenario_name}"`);
  console.log(`   - Projected Revenue:  $${comparison.scenario_b.total_new_revenue.toFixed(2)} (${(comparison.scenario_b.total_revenue_change_pct * 100).toFixed(2)}%)\n`);

  // STEP 9: Cleanup Created Scenarios
  console.log('8. Cleaning up test scenarios...');
  await predictFlow.scenarios.delete(scenarioA.id);
  await predictFlow.scenarios.delete(scenarioB.id);
  await predictFlow.scenarios.delete(clonedScenario.id);
  console.log('✅ Deleted test scenarios successfully.\n');

  console.log('🎉 All Scenario operations executed successfully!');
}

main().catch((err) => {
  console.error('❌ Scenario Operations Error:', err);
});
