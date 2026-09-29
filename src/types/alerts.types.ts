/**
 * Alert & Action Feed Types for PredictFlow SDK
 */

export type AlertMetricType = 'low_stock' | 'dead_stock' | 'sales_spike' | 'sales_drop' | 'stockout_risk' | string;

export interface AlertRule {
  id: string;
  store_id: string;
  name: string;
  metric_type: AlertMetricType;
  threshold_value: number;
  condition: 'gt' | 'lt' | 'eq' | 'gte' | 'lte' | string;
  is_active: boolean;
  channels: string[];
  created_at: string;
  updated_at: string;
}

export interface AlertRuleCreateInput {
  name: string;
  metric_type: AlertMetricType;
  threshold_value: number;
  condition: 'gt' | 'lt' | 'eq' | 'gte' | 'lte' | string;
  is_active?: boolean;
  channels?: string[];
}

export interface AlertRuleUpdateInput {
  name?: string;
  threshold_value?: number;
  condition?: string;
  is_active?: boolean;
  channels?: string[];
}

export interface AlertTemplate {
  id: string;
  name: string;
  description: string;
  metric_type: AlertMetricType;
  default_threshold: number;
  default_condition: string;
}

export interface AlertHistoryItem {
  id: string;
  rule_id: string;
  store_id: string;
  product_id?: string | null;
  message: string;
  triggered_value: number;
  status: 'triggered' | 'acknowledged' | 'resolved';
  created_at: string;
}

export interface ActionFeedItem {
  id: string;
  type: 'reorder' | 'dead_stock_discount' | 'price_adjust' | 'stockout_warning';
  title: string;
  description: string;
  product_id?: string;
  impact_score: number;
  suggested_action: string;
  created_at: string;
}
