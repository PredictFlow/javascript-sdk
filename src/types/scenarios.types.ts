/**
 * Scenario Simulation Types for PredictFlow SDK
 */

export interface Scenario {
  id: string;
  store_id: string;
  name: string;
  description?: string | null;
  status: 'draft' | 'running' | 'completed' | 'failed' | string;
  parameters: Record<string, unknown>;
  results?: ScenarioResult | null;
  created_at: string;
  updated_at: string;
}

export interface ScenarioCreateInput {
  name: string;
  description?: string;
  parameters: {
    price_change_pct?: number;
    marketing_budget_change_pct?: number;
    supply_lead_time_days?: number;
    target_product_ids?: string[];
    [key: string]: unknown;
  };
}

export interface ScenarioUpdateInput {
  name?: string;
  description?: string;
  parameters?: Record<string, unknown>;
}

export interface ScenarioResult {
  projected_revenue: number;
  projected_profit: number;
  projected_units_sold: number;
  stockout_risk_count: number;
  product_impacts?: ScenarioProductImpact[];
}

export interface ScenarioProductImpact {
  product_id: string;
  sku: string;
  name: string;
  revenue_delta_pct: number;
  units_delta_pct: number;
  stockout_risk: boolean;
}

export interface ScenarioComparison {
  scenarios: Scenario[];
  metric_comparisons: {
    revenue: Record<string, number>;
    profit: Record<string, number>;
    units: Record<string, number>;
  };
}
