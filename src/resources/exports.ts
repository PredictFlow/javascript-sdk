import { BaseResource } from '../core/base-resource';
import { QueryParams } from '../core/request-builder';
import {
  ScheduledReport,
  ScheduledReportCreateInput,
  ScheduledReportUpdateInput,
  ExportProductsOptions,
  ExportSalesOptions,
  ExportInventoryOptions,
  ExportForecastsOptions,
  ExportDashboardOptions,
} from '../types/exports.types';

export class ExportsResource extends BaseResource {
  /**
   * Export store product catalog dataset (CSV or XLSX).
   */
  async exportProducts(storeId: string, options?: ExportProductsOptions): Promise<string> {
    return this.http.get<string>(`/exports/stores/${storeId}/products`, {
      query: options as unknown as QueryParams,
    });
  }

  /**
   * Export product catalog across all owned stores.
   */
  async exportAllStoresProducts(options?: { format?: 'xlsx' }): Promise<string> {
    return this.http.get<string>('/exports/products', {
      query: options as unknown as QueryParams,
    });
  }

  /**
   * Export store sales history dataset (CSV or XLSX).
   */
  async exportSales(storeId: string, options?: ExportSalesOptions): Promise<string> {
    return this.http.get<string>(`/exports/stores/${storeId}/sales`, {
      query: options as unknown as QueryParams,
    });
  }

  /**
   * Export store inventory levels and stockout projections.
   */
  async exportInventory(storeId: string, options?: ExportInventoryOptions): Promise<string> {
    return this.http.get<string>(`/exports/stores/${storeId}/inventory`, {
      query: options as unknown as QueryParams,
    });
  }

  /**
   * Export demand forecast projections.
   */
  async exportForecasts(storeId: string, options?: ExportForecastsOptions): Promise<string> {
    return this.http.get<string>(`/exports/stores/${storeId}/forecasts`, {
      query: options as unknown as QueryParams,
    });
  }

  /**
   * Export recommended inventory reorder batches.
   */
  async exportReorder(storeId: string, options?: { format?: 'csv' | 'xlsx' }): Promise<string> {
    return this.http.get<string>(`/exports/stores/${storeId}/reorder`, {
      query: options as unknown as QueryParams,
    });
  }

  /**
   * Export dead stock liquidation candidate list.
   */
  async exportDeadStock(storeId: string, options?: { format?: 'csv' | 'xlsx' }): Promise<string> {
    return this.http.get<string>(`/exports/stores/${storeId}/dead-stock`, {
      query: options as unknown as QueryParams,
    });
  }

  /**
   * Export account-wide dashboard summary metrics.
   */
  async exportDashboard(options?: ExportDashboardOptions): Promise<string> {
    return this.http.get<string>('/exports/dashboard', {
      query: options as unknown as QueryParams,
    });
  }

  /**
   * List scheduled automated email reports for a store.
   */
  async listScheduledReports(storeId: string): Promise<ScheduledReport[]> {
    return this.http.get<ScheduledReport[]>(`/stores/${storeId}/scheduled-reports`);
  }

  /**
   * Create a new scheduled automated email report.
   */
  async createScheduledReport(storeId: string, data: ScheduledReportCreateInput): Promise<ScheduledReport> {
    return this.http.post<ScheduledReport>(`/stores/${storeId}/scheduled-reports`, data);
  }

  /**
   * Update settings for an existing scheduled report.
   */
  async updateScheduledReport(reportId: string, data: ScheduledReportUpdateInput): Promise<ScheduledReport> {
    return this.http.patch<ScheduledReport>(`/scheduled-reports/${reportId}`, data);
  }

  /**
   * Trigger an immediate on-demand test delivery of a scheduled report.
   */
  async sendReportNow(reportId: string): Promise<ScheduledReport> {
    return this.http.post<ScheduledReport>(`/scheduled-reports/${reportId}/send`);
  }

  /**
   * Delete a scheduled report.
   */
  async deleteScheduledReport(reportId: string): Promise<void> {
    return this.http.delete<void>(`/scheduled-reports/${reportId}`);
  }
}
