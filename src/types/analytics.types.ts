/**
 * Analytics Types for PredictFlow SDK
 */

export interface KpiPeriodMetrics {
  revenue: string | number;
  orders: number;
  aov: string | number;
}

export interface KpiGrowthMetrics {
  revenue_growth_pct: number | null;
  orders_growth_pct: number | null;
  aov_growth_pct: number | null;
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
  revenue: string | number;
  orders: number;
  aov: string | number;
}

export interface AnalyticsTrendResponse {
  period_days: number;
  interval: string;
  items: AnalyticsTrendPoint[];
}

export interface DayOfWeekPoint {
  day_index: number;
  day_name: string;
  revenue: string | number;
  orders: number;
  pct_of_week: number;
}

export interface DayOfWeekResponse {
  period_days: number;
  peak_day: string;
  peak_revenue: string | number;
  peak_pct: number;
  items: DayOfWeekPoint[];
}

export interface ProductGrowthPoint {
  store_id?: string | null;
  sku: string;
  product_name: string;
  units: number;
  revenue: string | number;
  previous_units: number;
  growth_pct: number | null;
}

export interface ProductGrowthResponse {
  period_days: number;
  items: ProductGrowthPoint[];
}

export interface SegmentBreakdown {
  name: string;
  count: number;
  percentage: number;
  description?: string;
}

export interface CustomerSummary {
  customer_email: string;
  total_orders: number;
  total_spend: string;
  average_order_value: string;
  first_order_date: string;
  last_order_date: string;
}

export interface CustomerAnalyticsResponse {
  total_customers_identified: number;
  orders_without_customer_email: number;
  churn_rate_pct: number;
  average_clv: string;
  segments: SegmentBreakdown[];
  top_customers_by_clv: CustomerSummary[];
}
