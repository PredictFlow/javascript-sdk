/**
 * Pricing & Elasticity Types for PredictFlow SDK
 */

export type PricingStrategy =
  | 'maximize_revenue'
  | 'maximize_profit'
  | 'maximize_volume'
  | 'competitive'
  | 'cost_plus';

export interface ElasticityResponse {
  product_id: string;
  lookback_days: number;
  elasticity: number;
  elasticity_std: number;
  confidence_interval: number[];
  elasticity_type: string;
  interpretation: string;
  r_squared: number;
  n_observations: number;
  n_price_points: number;
  data_quality: string;
}

export interface OptimizeResponse {
  product_id: string;
  product_sku: string;
  strategy: string;
  current_price: number;
  cost: number | null;
  recommended_price: number;
  price_change_pct: number;
  elasticity: number;
  elasticity_confidence: string;
  expected_volume_change_pct: number;
  expected_revenue_change_pct: number;
  expected_profit_change_pct: number | null;
  current_margin_pct: number | null;
  new_margin_pct: number | null;
}

export interface SimulateResponse {
  product_id: string;
  product_sku: string;
  current_price: number;
  new_price: number;
  cost: number | null;
  elasticity: number;
  elasticity_confidence: string;
  price_change_pct: number;
  expected_volume_change_pct: number;
  expected_revenue_change_pct: number;
  expected_profit_change_pct: number | null;
  current_margin_pct: number | null;
  new_margin_pct: number | null;
  recommendation: string;
}

export interface BatchOptimizeItem {
  product_id: string;
  product_sku: string;
  product_name: string;
  current_price: number;
  recommended_price: number;
  price_change_pct: number;
  elasticity_confidence: string;
  expected_revenue_change_pct: number;
  expected_profit_change_pct: number | null;
}

export interface CrossElasticityResponse {
  product_id: string;
  related_product_id: string;
  cross_elasticity: number;
  std_error: number;
  r_squared: number;
  p_value: number;
  n_observations: number;
  relationship: string;
}

export interface CompetitorPrice {
  id: string;
  product_id: string;
  competitor_name: string;
  competitor_url?: string | null;
  price: string | number;
  currency?: string | null;
  created_at: string;
}

export interface CompetitorPriceInput {
  competitor_name: string;
  competitor_url?: string;
  price: number;
  currency?: string;
}

export interface RepriceSuggestionResponse {
  product_id: string;
  product_sku: string;
  current_price: number;
  competitor_name: string;
  competitor_price: number;
  competitor_observed_at: string;
  suggested_price: number;
  price_change_pct: number;
}

export interface GetElasticityOptions {
  lookback_days?: number;
}

export interface OptimizePriceOptions {
  strategy?: PricingStrategy;
  competitor_price?: number;
  cost_override?: number;
}

export interface SimulatePriceOptions {
  new_price: number;
  cost_override?: number;
}

export interface BatchOptimizeOptions {
  strategy?: PricingStrategy;
  limit?: number;
}

export interface GetCrossElasticityOptions {
  lookback_days?: number;
}
