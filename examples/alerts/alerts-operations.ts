import {
  PredictFlow,
  type AlertTemplate,
  type AlertRule,
} from '@predictflow/sdk';

async function main() {
  const predictFlow = new PredictFlow({
    apiKey: process.env.PREDICTFLOW_API_KEY || 'pk_live_6866099dd58c1112d8ce5579c1e3586f07160171cf20718553eb4eb5ff82a30a',
    baseUrl: process.env.PREDICTFLOW_BASE_URL || 'http://localhost:8000/api/v1',
  });

  console.log('=== PredictFlow Alerts & Anomaly Detection Rules ===\n');

  // STEP 1: Find a store & products
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

  const productsResponse = await predictFlow.products.list({ store_id: targetStore.id, limit: 2 });
  const sampleProduct = productsResponse.items[0];

  // STEP 2: List Alert Templates
  console.log('1. Fetching available Alert Rule Templates...');
  const templates: AlertTemplate[] = await predictFlow.alerts.listTemplates();
  console.log(`✅ System Alert Templates (${templates.length}):`);
  for (const t of templates) {
    console.log(`   - [${t.metric_type}] ${t.name}: Default Threshold: ${t.default_threshold} (Product Scoped: ${t.supports_product_scope})`);
  }
  console.log('');

  // STEP 3: Create Low Stock Alert Rule
  console.log('2. Creating Low Stock Alert Rule for store...');
  const lowStockRule: AlertRule = await predictFlow.alerts.createRule(targetStore.id, {
    metric_type: 'low_stock',
    name: 'Urgent Low Stock Alert (< 8 units)',
    threshold: 8,
    product_ids: sampleProduct ? [sampleProduct.id] : [],
    is_active: true,
  });

  console.log(`✅ Created Alert Rule (ID: ${lowStockRule.id}):`);
  console.log(`   - Name:             "${lowStockRule.name}"`);
  console.log(`   - Metric Type:      ${lowStockRule.metric_type}`);
  console.log(`   - Threshold:        ${lowStockRule.threshold}`);
  console.log(`   - Target Products:  ${lowStockRule.product_ids.length} product(s)\n`);

  // STEP 4: Create Store-Scoped Revenue Drop Alert Rule
  console.log('3. Creating Store-Scoped Revenue Drop Alert Rule (30% drop)...');
  const revDropRule: AlertRule = await predictFlow.alerts.createRule(targetStore.id, {
    metric_type: 'revenue_drop',
    name: 'Sudden Revenue Drop Alert (> 30%)',
    threshold: 0.30,
    is_active: true,
  });

  console.log(`✅ Created Alert Rule (ID: ${revDropRule.id}): "${revDropRule.name}"\n`);

  // STEP 5: List Alert Rules for Store
  console.log('4. Listing all active Alert Rules for store...');
  const storeRules = await predictFlow.alerts.listRules(targetStore.id);
  console.log(`✅ Active Rules in Store (${storeRules.length}):`);
  for (const r of storeRules) {
    console.log(`   - [${r.id}] "${r.name}" (${r.metric_type}, threshold: ${r.threshold}, active: ${r.is_active})`);
  }
  console.log('');

  // STEP 6: Get Rule by ID
  console.log('5. Fetching Rule by ID...');
  const fetchedRule = await predictFlow.alerts.getRule(lowStockRule.id);
  console.log(`✅ Retrieved Rule: "${fetchedRule.name}" (Active: ${fetchedRule.is_active})\n`);

  // STEP 7: Update Rule
  console.log('6. Updating Rule threshold to 5 units & renaming...');
  const updatedRule = await predictFlow.alerts.updateRule(lowStockRule.id, {
    name: 'Critical Restock Alert (< 5 units)',
    threshold: 5,
  });
  console.log(`✅ Updated Rule: "${updatedRule.name}" (Threshold: ${updatedRule.threshold})\n`);

  // STEP 8: Check Rule History
  console.log('7. Checking incident evaluation history for rule...');
  const history = await predictFlow.alerts.getRuleHistory(lowStockRule.id);
  console.log(`✅ Incidents recorded for rule: ${history.length}\n`);

  // STEP 9: Cleanup Created Rules
  console.log('8. Cleaning up test alert rules...');
  await predictFlow.alerts.deleteRule(lowStockRule.id);
  await predictFlow.alerts.deleteRule(revDropRule.id);
  console.log('✅ Deleted test alert rules successfully.\n');

  console.log('🎉 All Alert operations executed successfully!');
}

main().catch((err) => {
  console.error('❌ Alerts Operations Error:', err);
});
