/**
 * Analytics Types for PredictFlow SDK
 */

export interface KpiPeriodMetrics {
  total_revenue: number;
  total_orders: number;
  units_sold: number;
  average_order_value: number;
}

export interface KpiGrowthMetrics {
  revenue_growth: number;
  orders_growth: number;
  units_growth: number;
  aov_growth: number;
}

export interface AnalyticsKpisResponse {
  period_days: number;
  current: KpiPeriodMetrics;
  previous: KpiPeriodMetrics;
  growth: KpiGrowthMetrics;
  active_stores: number;
  products_tracked: number;
}

export interface AnalyticsTrendPoint {
  date: string;
  revenue: number;
  orders: number;
  units: number;
}

export interface AnalyticsTrendResponse {
  store_id?: string;
  points: AnalyticsTrendPoint[];
  total_revenue: number;
  total_orders: number;
}

export interface DayOfWeekDataPoint {
  day_of_week: number;
  day_name: string;
  order_count: number;
  revenue: number;
  percentage_of_week: number;
}

export interface CustomerAnalyticsSummary {
  total_customers: number;
  repeat_customer_rate: number;
  average_clv: number;
  churn_rate_risk: number;
  cohort_data?: Record<string, unknown>;
}
