import { PredictFlow } from '@predictflow/sdk';

async function main() {
  const predictFlow = new PredictFlow({
    apiKey: process.env.PREDICTFLOW_API_KEY || 'pk_live_6866099dd58c1112d8ce5579c1e3586f07160171cf20718553eb4eb5ff82a30a',
    baseUrl: process.env.PREDICTFLOW_BASE_URL || 'http://localhost:8000/api/v1',
  });

  const stores = await predictFlow.stores.list();
  if (stores.length === 0 || !stores[0]) return;

  const products = await predictFlow.products.list({ store_id: stores[0].id, limit: 1 });
  if (products.items.length === 0 || !products.items[0]) return;

  const product = products.items[0];

  // 1. Generate 30-day demand forecast
  console.log(`Generating forecast for product "${product.name}" (${product.sku})...`);
  const forecast = await predictFlow.predictions.forecastProduct(product.id, {
    horizon_days: 30,
    model: 'prophet',
  });

  console.log(`Forecast ID: ${forecast.id}`);
  console.log(`Model Used: ${forecast.model_name}`);
  const pointForecast = forecast.forecast_data.point_forecast || [];
  console.log(`Forecasted Points: ${pointForecast.length} daily projected values`);

  // 2. Simulate stockout risk
  const stockout = await predictFlow.predictions.simulateStockout(forecast.id, {
    current_stock: 15,
  });

  console.log(`Expected Days to Stockout: ${stockout.expected_days_until_stockout ?? 'N/A'} days`);
  console.log(`Total Stockout Probability: ${(stockout.total_stockout_probability * 100).toFixed(1)}%`);

  // 3. Get optimal inventory reorder recommendation
  const recommendation = await predictFlow.predictions.getInventoryRecommendation(forecast.id, {
    current_stock: 15,
    lead_time_days: 7,
  });
  console.log('Reorder Recommendation:');
  console.log(` - Reorder Point: ${recommendation.recommendation.reorder_point} units`);
  console.log(` - Reorder Quantity: ${recommendation.recommendation.reorder_quantity} units`);
  console.log(` - Urgency: ${recommendation.action.urgency.toUpperCase()}`);
}

main().catch(console.error);
