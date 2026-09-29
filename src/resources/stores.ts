import { BaseResource } from '../core/base-resource';
import {
  Store,
  StoreCreateInput,
  StoreUpdateInput,
  StoreSyncResult,
  StoreSyncHistoryItem,
  ImportResult,
} from '../types/stores.types';

export class StoresResource extends BaseResource {
  /**
   * List all connected stores for the authenticated account.
   */
  async list(): Promise<Store[]> {
    return this.http.get<Store[]>('/stores');
  }

  /**
   * Get store details by store ID.
   */
  async get(storeId: string): Promise<Store> {
    return this.http.get<Store>(`/stores/${storeId}`);
  }

  /**
   * Connect a new store (Shopify, WooCommerce, Custom).
   */
  async create(data: StoreCreateInput): Promise<Store> {
    return this.http.post<Store>('/stores', data);
  }

  /**
   * Update store settings.
   */
  async update(storeId: string, data: StoreUpdateInput): Promise<Store> {
    return this.http.patch<Store>(`/stores/${storeId}`, data);
  }

  /**
   * Disconnect and remove a store.
   */
  async delete(storeId: string): Promise<void> {
    return this.http.delete<void>(`/stores/${storeId}`);
  }

  /**
   * Test the connection credentials for a store.
   */
  async testConnection(storeId: string): Promise<{ connected: boolean; message: string }> {
    return this.http.post<{ connected: boolean; message: string }>(`/stores/${storeId}/test-connection`);
  }

  /**
   * Trigger a manual catalog/orders sync for a store.
   */
  async triggerSync(storeId: string, options?: { sync_type?: 'full' | 'incremental' }): Promise<StoreSyncResult> {
    return this.http.post<StoreSyncResult>(`/stores/${storeId}/sync`, options);
  }

  /**
   * Retrieve the sync logs and history for a store.
   */
  async getSyncHistory(storeId: string): Promise<StoreSyncHistoryItem[]> {
    return this.http.get<StoreSyncHistoryItem[]>(`/stores/${storeId}/sync-history`);
  }

  /**
   * Import products from CSV content into a store.
   *
   * @param storeId Target store ID
   * @param csvContent CSV file content as a string, Blob, or File
   * @param filename Optional filename (defaults to 'products.csv')
   */
  async importProductsCsv(
    storeId: string,
    csvContent: string | Blob,
    filename = 'products.csv'
  ): Promise<ImportResult> {
    const formData = new FormData();
    const blob = typeof csvContent === 'string' ? new Blob([csvContent], { type: 'text/csv' }) : csvContent;
    formData.append('file', blob, filename);
    return this.http.post<ImportResult>(`/stores/${storeId}/import/products`, formData);
  }

  /**
   * Import historical orders from CSV content into a store.
   *
   * @param storeId Target store ID
   * @param csvContent CSV file content as a string, Blob, or File
   * @param filename Optional filename (defaults to 'orders.csv')
   */
  async importOrdersCsv(
    storeId: string,
    csvContent: string | Blob,
    filename = 'orders.csv'
  ): Promise<ImportResult> {
    const formData = new FormData();
    const blob = typeof csvContent === 'string' ? new Blob([csvContent], { type: 'text/csv' }) : csvContent;
    formData.append('file', blob, filename);
    return this.http.post<ImportResult>(`/stores/${storeId}/import/orders`, formData);
  }
}
