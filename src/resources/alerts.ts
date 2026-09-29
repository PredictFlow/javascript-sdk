import { BaseResource } from '../core/base-resource';
import {
  AlertRule,
  AlertRuleCreateInput,
  AlertRuleUpdateInput,
  AlertTemplate,
  AlertHistoryItem,
  ActionFeedItem,
} from '../types/alerts.types';
import { MessageResponse } from '../types/common';

export class AlertsResource extends BaseResource {
  /**
   * List available default alert templates.
   */
  async listTemplates(): Promise<AlertTemplate[]> {
    return this.http.get<AlertTemplate[]>('/alert-templates');
  }

  /**
   * List alert rules configured for a store.
   */
  async listRules(storeId: string): Promise<AlertRule[]> {
    return this.http.get<AlertRule[]>(`/stores/${storeId}/alert-rules`);
  }

  /**
   * Get single alert rule details.
   */
  async getRule(ruleId: string): Promise<AlertRule> {
    return this.http.get<AlertRule>(`/alert-rules/${ruleId}`);
  }

  /**
   * Create a new alert rule for a store.
   */
  async createRule(storeId: string, data: AlertRuleCreateInput): Promise<AlertRule> {
    return this.http.post<AlertRule>(`/stores/${storeId}/alert-rules`, data);
  }

  /**
   * Update an existing alert rule.
   */
  async updateRule(ruleId: string, data: AlertRuleUpdateInput): Promise<AlertRule> {
    return this.http.patch<AlertRule>(`/alert-rules/${ruleId}`, data);
  }

  /**
   * Delete an alert rule.
   */
  async deleteRule(ruleId: string): Promise<MessageResponse> {
    return this.http.delete<MessageResponse>(`/alert-rules/${ruleId}`);
  }

  /**
   * Get historical triggered alerts for a rule.
   */
  async getRuleHistory(ruleId: string): Promise<AlertHistoryItem[]> {
    return this.http.get<AlertHistoryItem[]>(`/alert-rules/${ruleId}/history`);
  }

  /**
   * Get dynamic action feed recommendations for a store.
   */
  async getActionFeed(storeId: string): Promise<ActionFeedItem[]> {
    return this.http.get<ActionFeedItem[]>(`/stores/${storeId}/action-feed`);
  }

  /**
   * Generate dead stock liquidation report for a store.
   */
  async getDeadStockReport(storeId: string): Promise<Record<string, unknown>> {
    return this.http.get<Record<string, unknown>>(`/stores/${storeId}/dead-stock-report`);
  }
}
