/**
 * Export & Scheduled Report Types for PredictFlow SDK
 */

export interface ExportJobResponse {
  job_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  download_url?: string | null;
  format: 'csv' | 'json' | 'pdf';
  created_at: string;
}

export interface ScheduledReport {
  id: string;
  store_id: string;
  report_type: 'daily_summary' | 'weekly_inventory' | 'monthly_forecast';
  frequency: 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  is_active: boolean;
  last_sent_at?: string | null;
  created_at: string;
}

export interface ScheduledReportCreateInput {
  report_type: 'daily_summary' | 'weekly_inventory' | 'monthly_forecast';
  frequency: 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  is_active?: boolean;
}
