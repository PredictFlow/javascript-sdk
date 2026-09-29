import { BaseResource } from '../core/base-resource';
import {
  AnalyticsKpisResponse,
  AnalyticsTrendResponse,
  DayOfWeekResponse,
  ProductGrowthResponse,
  CustomerAnalyticsResponse,
} from '../types/analytics.types';

export class AnalyticsResource extends BaseResource {
  /**
   * Get core dashboard KPIs and growth percentages.
   */
  async getKpis(params?: { days?: number; store_id?: string }): Promise<AnalyticsKpisResponse> {
    return this.http.get<AnalyticsKpisResponse>('/analytics/kpis', { query: params });
  }

  /**
   * Get revenue and unit sales historical trend data points.
   */
  async getTrend(params?: {
    days?: number;
    store_id?: string;
    interval?: 'auto' | 'day' | 'week' | 'month';
  }): Promise<AnalyticsTrendResponse> {
    return this.http.get<AnalyticsTrendResponse>('/analytics/trend', { query: params });
  }

  /**
   * Get day-of-week sales and order distribution patterns.
   */
  async getDayOfWeek(params?: { days?: number; store_id?: string }): Promise<DayOfWeekResponse> {
    return this.http.get<DayOfWeekResponse>('/analytics/day-of-week', { query: params });
  }

  /**
   * Get product growth breakdown and fast/slow movers.
   */
  async getProductGrowth(params?: {
    days?: number;
    store_id?: string;
    limit?: number;
  }): Promise<ProductGrowthResponse> {
    return this.http.get<ProductGrowthResponse>('/analytics/product-growth', { query: params });
  }

  /**
   * Get customer analytics, repeat purchase rate, CLV, and customer segmentation.
   */
  async getCustomerAnalytics(storeId: string, params?: { days?: number }): Promise<CustomerAnalyticsResponse> {
    return this.http.get<CustomerAnalyticsResponse>(`/stores/${storeId}/customer-analytics`, { query: params });
  }
}
