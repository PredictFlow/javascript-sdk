/**
 * Scenario Simulation & What-If Types for PredictFlow SDK
 */

export interface Scenario {
  id: string;
  store_id: string;
  name: string;
  description?: string | null;
  price_change_pct: number;
  demand_shift_pct: number;
  created_at: string;
}

export interface ScenarioCreateInput {
  name: string;
  description?: string;
  price_change_pct?: number;
  demand_shift_pct?: number;
}

export interface ScenarioUpdateInput {
  name?: string;
  description?: string;
  price_change_pct?: number;
  demand_shift_pct?: number;
}

export interface ScenarioCloneInput {
  name?: string;
}

export interface ScenarioProductImpact {
  product_id: string;
  product_sku: string;
  product_name: string;
  current_price: number;
  new_price: number;
  baseline_monthly_units: number;
  elasticity_confidence: string;
  current_revenue: number;
  new_revenue: number;
  revenue_change_pct: number;
  current_profit: number | null;
  new_profit: number | null;
  profit_change_pct: number | null;
}

export interface ScenarioResult {
  scenario_id: string;
  scenario_name: string;
  price_change_pct: number;
  demand_shift_pct: number;
  products: ScenarioProductImpact[];
  total_current_revenue: number;
  total_new_revenue: number;
  total_revenue_change_pct: number;
  total_current_profit: number | null;
  total_new_profit: number | null;
  total_profit_change_pct: number | null;
}

export interface ScenarioComparison {
  scenario_a: ScenarioResult;
  scenario_b: ScenarioResult;
}

export interface ScenarioCompareParams {
  scenario_a_id: string;
  scenario_b_id: string;
}
