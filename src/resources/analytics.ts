import { BaseResource } from '../core/base-resource';
import {
  AnalyticsKpisResponse,
  AnalyticsTrendResponse,
  DayOfWeekDataPoint,
  CustomerAnalyticsSummary,
} from '../types/analytics.types';

export class AnalyticsResource extends BaseResource {
  /**
   * Get core dashboard KPIs and growth percentages.
   */
  async getKpis(params?: { period_days?: number; store_id?: string }): Promise<AnalyticsKpisResponse> {
    return this.http.get<AnalyticsKpisResponse>('/analytics/kpis', { query: params });
  }

  /**
   * Get revenue and unit sales historical trend data points.
   */
  async getTrend(params?: { period_days?: number; store_id?: string }): Promise<AnalyticsTrendResponse> {
    return this.http.get<AnalyticsTrendResponse>('/analytics/trend', { query: params });
  }

  /**
   * Get day-of-week sales and order distribution patterns.
   */
  async getDayOfWeek(params?: { period_days?: number; store_id?: string }): Promise<DayOfWeekDataPoint[]> {
    return this.http.get<DayOfWeekDataPoint[]>('/analytics/day-of-week', { query: params });
  }

  /**
   * Get product growth breakdown and fast/slow movers.
   */
  async getProductGrowth(params?: { period_days?: number; store_id?: string }): Promise<Record<string, unknown>> {
    return this.http.get<Record<string, unknown>>('/analytics/product-growth', { query: params });
  }

  /**
   * Get customer analytics, repeat purchase rate, and CLV insights.
   */
  async getCustomerAnalytics(storeId: string): Promise<CustomerAnalyticsSummary> {
    return this.http.get<CustomerAnalyticsSummary>(`/stores/${storeId}/customer-analytics`);
  }
}
