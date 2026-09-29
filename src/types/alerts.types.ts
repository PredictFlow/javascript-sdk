/**
 * Alert & Notification Rule Types for PredictFlow SDK
 */

export type AlertMetricType =
  | 'low_stock'
  | 'stockout_risk'
  | 'forecast_accuracy_drop'
  | 'margin_below'
  | 'revenue_drop';

export interface AlertTemplate {
  metric_type: AlertMetricType;
  name: string;
  description: string;
  default_threshold: string | number;
  supports_product_scope: boolean;
}

export interface AlertRuleCreateInput {
  metric_type: AlertMetricType;
  name?: string;
  threshold?: number | string;
  product_ids?: string[];
  is_active?: boolean;
}

export interface AlertRuleUpdateInput {
  name?: string;
  threshold?: number | string;
  is_active?: boolean;
}

export interface AlertRule {
  id: string;
  store_id: string;
  product_ids: string[];
  name: string;
  metric_type: AlertMetricType;
  threshold: string | number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AlertHistoryItem {
  id: string;
  alert_rule_id: string;
  product_id: string | null;
  metric_value: string | number;
  threshold: string | number;
  triggered_at: string;
  resolved_at: string | null;
}
