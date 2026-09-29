/**
 * Export & Scheduled Report Types for PredictFlow SDK
 */

export type ExportFormat = 'csv' | 'xlsx';

export type ReportType = 'inventory' | 'sales' | 'forecast' | 'reorder';

export type ReportCadence = 'daily' | 'weekly' | 'monthly';

export interface ExportProductsOptions {
  format?: ExportFormat;
}

export interface ExportSalesOptions {
  format?: ExportFormat;
  days?: number;
}

export interface ExportInventoryOptions {
  format?: ExportFormat;
  days?: number;
}

export interface ExportForecastsOptions {
  format?: ExportFormat;
  product_id?: string;
  duration_days?: number;
}

export interface ExportDashboardOptions {
  format?: ExportFormat;
  days?: number;
}

export interface ScheduledReport {
  id: string;
  store_id: string;
  report_type: ReportType;
  cadence: ReportCadence;
  format: ExportFormat;
  is_active: boolean;
  last_sent_at?: string | null;
  created_at: string;
}

export interface ScheduledReportCreateInput {
  report_type: ReportType;
  cadence: ReportCadence;
  format?: ExportFormat;
  is_active?: boolean;
}

export interface ScheduledReportUpdateInput {
  cadence?: ReportCadence;
  format?: ExportFormat;
  is_active?: boolean;
}
