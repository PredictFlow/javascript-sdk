/**
 * Store Types for PredictFlow SDK
 */

export type StorePlatform = 'shopify' | 'woocommerce' | 'custom' | string;
export type StoreStatus = 'active' | 'inactive' | 'syncing' | 'error' | string;

export interface Store {
  id: string;
  platform: StorePlatform;
  name: string;
  store_url: string;
  status: StoreStatus;
  currency: string | null;
  created_at: string;
  updated_at: string;
}

export interface StoreCreateInput {
  platform: StorePlatform;
  name: string;
  store_url?: string;
  credentials?: Record<string, unknown>;
}

export interface StoreUpdateInput {
  name?: string;
  store_url?: string;
  status?: StoreStatus;
  currency?: string;
}

export interface StoreSyncResult {
  message: string;
  task_id?: string;
  status?: string;
}

export interface StoreSyncHistoryItem {
  id: string;
  store_id: string;
  sync_type: string;
  status: string;
  items_synced?: number;
  started_at: string;
  completed_at?: string | null;
  error_message?: string | null;
}

export interface ImportResult {
  created: number;
  updated: number;
  errors: { row?: number; message: string }[];
}

