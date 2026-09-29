/**
 * Pricing & Elasticity Types for PredictFlow SDK
 */

export interface PriceElasticityResponse {
  product_id: string;
  elasticity_coefficient: number;
  elasticity_category: 'elastic' | 'inelastic' | 'unitary';
  confidence_score: number;
  optimal_price: number;
  current_price: number;
  recommended_action: string;
}

export interface PriceOptimizationRequest {
  target_metric?: 'revenue' | 'profit' | 'units';
  min_price?: number;
  max_price?: number;
  target_margin_pct?: number;
}

export interface PriceOptimizationResponse {
  product_id: string;
  current_price: number;
  suggested_price: number;
  projected_demand_delta_pct: number;
  projected_revenue_delta_pct: number;
  projected_profit_delta_pct: number;
}

export interface PriceSimulationRequest {
  test_price: number;
}

export interface PriceSimulationResponse {
  product_id: string;
  original_price: number;
  simulated_price: number;
  predicted_daily_units: number;
  predicted_monthly_revenue: number;
  demand_impact_percentage: number;
}

export interface CompetitorPrice {
  id: string;
  product_id: string;
  competitor_name: string;
  competitor_url?: string | null;
  price: number;
  currency: string;
  scraped_at: string;
}

export interface CompetitorPriceInput {
  competitor_name: string;
  competitor_url?: string;
  price: number;
  currency?: string;
}

export interface RepriceSuggestion {
  product_id: string;
  current_price: number;
  competitor_lowest_price: number;
  competitor_average_price: number;
  suggested_reprice: number;
  strategy_reason: string;
}
