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
  [key: string]: unknown;
}

export interface ForecastData {
  point_forecast?: number[];
  lower_bound?: number[];
  upper_bound?: number[];
  dates?: string[];
  total_forecasted_units?: number;
  points?: ForecastDataPoint[];
  [key: string]: unknown;
}

export interface Prediction {
  id: string;
  product_id: string;
  prediction_type: string;
  horizon_days: number;
  model_name: string;
  forecast_data: ForecastData;
  accuracy_metrics: Record<string, unknown>;
  model_params: Record<string, unknown>;
  generated_at: string;
}

export interface ProductForecastRequest {
  horizon_days?: number;
  model?: 'prophet' | 'xgboost' | string;
}

export interface StoreForecastRequest {
  horizon_days?: number;
  model?: 'prophet' | 'xgboost' | string;
}

export interface ForecastBatchResponse {
  store_id: string;
  job_id: string;
  status: string;
  products_queued: number;
}

export interface TotalDemandSummary {
  mean: number;
  std: number;
  percentiles: Record<string, number>;
}

export interface SimulationResponse {
  product_id: string;
  prediction_id: string;
  horizon_days: number;
  n_simulations: number;
  distribution: string;
  dates: string[];
  mean_demand: number[];
  std_demand: number[];
  percentiles: Record<string, number[]>;
  total_demand: TotalDemandSummary;
}

export interface StockoutResponse {
  product_id: string;
  prediction_id: string;
  current_stock: number;
  horizon_days: number;
  dates: string[];
  stockout_probability_by_day: number[];
  total_stockout_probability: number;
  expected_days_until_stockout: number | null;
  median_days_until_stockout: number | null;
}

export interface RecommendationDetail {
  reorder_point: number;
  reorder_quantity: number;
  safety_stock: number;
  max_stock: number;
}

export interface RiskMetrics {
  stockout_probability: number;
  expected_days_until_stockout: number | null;
}

export interface ActionDetail {
  should_reorder_now: boolean;
  urgency: 'critical' | 'high' | 'medium' | 'low' | string;
}

export interface InventoryRecommendationResponse {
  product_id: string;
  prediction_id: string;
  product_sku: string;
  current_stock: number;
  days_of_stock: number | null;
  lead_time_days: number;
  target_service_level: number;
  recommendation: RecommendationDetail;
  risk_metrics: RiskMetrics;
  action: ActionDetail;
}

export interface PolicyOptimizationResponse {
  product_id: string;
  prediction_id: string;
  current_stock: number;
  lead_time_days: number;
  target_service_level: number;
  optimal_reorder_point: number;
  optimal_reorder_quantity: number;
  expected_service_level: number;
  expected_stockout_probability: number;
  expected_reorders_per_horizon: number;
  meets_target_service_level: boolean;
  tie_break_basis: string;
}
