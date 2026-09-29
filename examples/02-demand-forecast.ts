import { PredictFlow } from '../dist/index.mjs';

async function main() {
  const predictFlow = new PredictFlow();

  const productId = 'prod_12345';

  // 1. Generate 30-day demand forecast
  console.log(`Generating forecast for product ${productId}...`);
  const forecast = await predictFlow.predictions.forecastProduct(productId, {
    horizon_days: 30,
    include_confidence_intervals: true,
  });

  console.log(`Forecast ID: ${forecast.id}`);
  console.log(`Model Used: ${forecast.model_name}`);
  console.log(`Forecasted Units: ${forecast.forecast_data.total_forecasted_units}`);

  // 2. Simulate stockout risk
  const stockout = await predictFlow.predictions.simulateStockout(forecast.id, {
    lead_time_days: 7,
    safety_stock: 15,
  });

  console.log(`Days to Stockout: ${stockout.days_to_stockout} days`);
  console.log(`Stockout Risk Score: ${stockout.stockout_risk_score} / 100`);

  // 3. Get optimal inventory reorder recommendation
  const recommendation = await predictFlow.predictions.getInventoryRecommendation(forecast.id);
  console.log('Reorder Recommendation:');
  console.log(` - Optimal Reorder Point: ${recommendation.optimal_reorder_point} units`);
  console.log(` - Recommended Order Qty: ${recommendation.recommended_order_quantity} units`);
  console.log(` - Urgency: ${recommendation.urgency.toUpperCase()}`);
}

main().catch(console.error);
