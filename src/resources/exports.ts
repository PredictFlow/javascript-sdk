import { BaseResource } from '../core/base-resource';
import {
  ExportJobResponse,
  ScheduledReport,
  ScheduledReportCreateInput,
} from '../types/exports.types';
import { MessageResponse } from '../types/common';

export class ExportsResource extends BaseResource {
  /**
   * Export store product catalog dataset.
   */
  async exportProducts(storeId: string, format: 'csv' | 'json' = 'csv'): Promise<ExportJobResponse> {
    return this.http.get<ExportJobResponse>(`/exports/stores/${storeId}/products`, {
      query: { format },
    });
  }

  /**
   * Export store sales history dataset.
   */
  async exportSales(storeId: string, format: 'csv' | 'json' = 'csv'): Promise<ExportJobResponse> {
    return this.http.get<ExportJobResponse>(`/exports/stores/${storeId}/sales`, {
      query: { format },
    });
  }

  /**
   * Export store inventory levels and stockout projections.
   */
  async exportInventory(storeId: string, format: 'csv' | 'json' = 'csv'): Promise<ExportJobResponse> {
    return this.http.get<ExportJobResponse>(`/exports/stores/${storeId}/inventory`, {
      query: { format },
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
   * Trigger an immediate test delivery of a scheduled report.
   */
  async sendReportNow(reportId: string): Promise<MessageResponse> {
    return this.http.post<MessageResponse>(`/scheduled-reports/${reportId}/send`);
  }

  /**
   * Delete a scheduled report.
   */
  async deleteScheduledReport(reportId: string): Promise<MessageResponse> {
    return this.http.delete<MessageResponse>(`/scheduled-reports/${reportId}`);
  }
}
