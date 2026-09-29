/**
 * Prediction Types for PredictFlow SDK
 */

export interface ForecastDataPoint {
  date: string;
  predicted_demand: number;
  lower_bound?: number;
  upper_bound?: number;
}

export interface PredictionAccuracyMetrics {
  mape?: number;
  rmse?: number;
  mae?: number;
  r2?: number;
}

export interface Prediction {
  id: string;
  product_id: string;
  prediction_type: string;
  horizon_days: number;
  model_name: string;
  forecast_data: {
    points?: ForecastDataPoint[];
    total_forecasted_units?: number;
    [key: string]: unknown;
  };
  accuracy_metrics: PredictionAccuracyMetrics;
  model_params: Record<string, unknown>;
  generated_at: string;
}

export interface ProductForecastRequest {
  horizon_days?: number;
  model_type?: string;
  include_confidence_intervals?: boolean;
}

export interface StoreForecastRequest {
  horizon_days?: number;
  product_ids?: string[];
}

export interface StockoutSimulationRequest {
  initial_stock?: number;
  lead_time_days?: number;
  safety_stock?: number;
  reorder_qty?: number;
}

export interface StockoutSimulationResult {
  product_id: string;
  days_to_stockout: number;
  stockout_risk_score: number;
  projected_lost_sales_units: number;
  projected_lost_revenue: number;
  stockout_date?: string | null;
}

export interface InventoryRecommendation {
  product_id: string;
  sku: string;
  name: string;
  current_stock: number;
  optimal_reorder_point: number;
  recommended_order_quantity: number;
  estimated_order_cost?: number;
  urgency: 'critical' | 'high' | 'medium' | 'low';
}

export interface PolicyOptimizationResult {
  product_id: string;
  service_level_target: number;
  calculated_safety_stock: number;
  recommended_reorder_point: number;
  annual_holding_cost: number;
  annual_ordering_cost: number;
}
