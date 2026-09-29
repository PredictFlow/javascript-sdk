import { BaseResource } from '../core/base-resource';
import {
  AlertRule,
  AlertRuleCreateInput,
  AlertRuleUpdateInput,
  AlertTemplate,
  AlertHistoryItem,
} from '../types/alerts.types';

export class AlertsResource extends BaseResource {
  /**
   * List available default alert rule templates.
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
  async deleteRule(ruleId: string): Promise<void> {
    return this.http.delete<void>(`/alert-rules/${ruleId}`);
  }

  /**
   * Get incident evaluation history recorded for a rule.
   */
  async getRuleHistory(ruleId: string): Promise<AlertHistoryItem[]> {
    return this.http.get<AlertHistoryItem[]>(`/alert-rules/${ruleId}/history`);
  }
}
