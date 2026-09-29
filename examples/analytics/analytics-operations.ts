import {
  PredictFlow,
  type AnalyticsKpisResponse,
  type AnalyticsTrendResponse,
  type DayOfWeekResponse,
  type ProductGrowthResponse,
  type CustomerAnalyticsResponse,
} from '@predictflow/sdk';

async function main() {
  const predictFlow = new PredictFlow({
    apiKey: process.env.PREDICTFLOW_API_KEY || 'pk_live_6866099dd58c1112d8ce5579c1e3586f07160171cf20718553eb4eb5ff82a30a',
    baseUrl: process.env.PREDICTFLOW_BASE_URL || 'http://localhost:8000/api/v1',
  });

  console.log('=== PredictFlow Analytics & Business Intelligence ===\n');

  // STEP 1: Find a store to analyze
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
  console.log(`Analyzing Store: "${targetStore.name}" (ID: ${targetStore.id})\n`);

  // STEP 2: Dashboard KPIs & Growth Metrics
  console.log('1. Fetching 30-day KPIs and Growth Rates...');
  const kpis: AnalyticsKpisResponse = await predictFlow.analytics.getKpis({
    days: 30,
    store_id: targetStore.id,
  });

  const revGrowth = kpis.growth.revenue_growth_pct !== null ? `${kpis.growth.revenue_growth_pct > 0 ? '+' : ''}${kpis.growth.revenue_growth_pct}%` : 'N/A';
  const ordersGrowth = kpis.growth.orders_growth_pct !== null ? `${kpis.growth.orders_growth_pct > 0 ? '+' : ''}${kpis.growth.orders_growth_pct}%` : 'N/A';
  const aovGrowth = kpis.growth.aov_growth_pct !== null ? `${kpis.growth.aov_growth_pct > 0 ? '+' : ''}${kpis.growth.aov_growth_pct}%` : 'N/A';

  console.log(`✅ Core KPIs (30-Day Window vs Previous 30 Days):`);
  console.log(`   - Total Revenue:       $${kpis.current.revenue} (Growth: ${revGrowth})`);
  console.log(`   - Total Orders:        ${kpis.current.orders} (Growth: ${ordersGrowth})`);
  console.log(`   - Average Order Value:  $${kpis.current.aov} (Growth: ${aovGrowth})`);
  console.log(`   - Active Stores:       ${kpis.active_stores}`);
  console.log(`   - Products Tracked:    ${kpis.products_tracked}\n`);

  // STEP 3: Revenue & Unit Sales Trend Time-Series
  console.log('2. Fetching Daily Revenue & Sales Trends...');
  const trend: AnalyticsTrendResponse = await predictFlow.analytics.getTrend({
    days: 30,
    store_id: targetStore.id,
    interval: 'day',
  });

  console.log(`✅ Revenue Trend (${trend.items.length} daily points):`);
  for (const point of trend.items.slice(-5)) {
    console.log(`   - [${point.date}] Revenue: $${point.revenue} | Orders: ${point.orders} | AOV: $${point.aov}`);
  }
  console.log('');

  // STEP 4: Day of Week Sales Distribution
  console.log('3. Analyzing Day-of-Week Sales Distribution...');
  const dayOfWeek: DayOfWeekResponse = await predictFlow.analytics.getDayOfWeek({
    days: 90,
    store_id: targetStore.id,
  });

  console.log(`✅ Day-of-Week Insights:`);
  console.log(`   - Peak Shopping Day:  ${dayOfWeek.peak_day} ($${dayOfWeek.peak_revenue}, ${dayOfWeek.peak_pct}% of total weekly revenue)`);
  for (const day of dayOfWeek.items) {
    console.log(`   - ${day.day_name.padEnd(9)}: $${day.revenue} (${day.pct_of_week}%) | Orders: ${day.orders}`);
  }
  console.log('');

  // STEP 5: Product Growth Velocity
  console.log('4. Analyzing Product Growth Velocity...');
  const productGrowth: ProductGrowthResponse = await predictFlow.analytics.getProductGrowth({
    days: 30,
    store_id: targetStore.id,
  });

  console.log(`✅ Products Analyzed for Growth: ${productGrowth.items.length}`);
  for (const p of productGrowth.items.slice(0, 5)) {
    console.log(`   - [${p.sku}] ${p.product_name}: Units: ${p.units} | Revenue: $${p.revenue} | Growth: ${p.growth_pct ?? 0}%`);
  }
  console.log('');

  // STEP 6: Customer Analytics & Segmentation
  console.log('5. Fetching Customer Lifetime Value & Segmentation...');
  const customers: CustomerAnalyticsResponse = await predictFlow.analytics.getCustomerAnalytics(targetStore.id, {
    days: 90,
  });

  console.log(`✅ Customer Analytics Overview:`);
  console.log(`   - Identified Customers:  ${customers.total_customers_identified}`);
  console.log(`   - Churn Rate Risk:       ${customers.churn_rate_pct}%`);
  console.log(`   - Average CLV:           $${customers.average_clv}`);
  console.log(`   - Customer Segments:`);
  for (const seg of customers.segments) {
    console.log(`     * ${seg.name}: ${seg.count} customers (${seg.percentage}%)`);
  }
  console.log('');

  console.log('🎉 All Analytics operations executed successfully!');
}

main().catch((err) => {
  console.error('❌ Analytics Operations Error:', err);
});
