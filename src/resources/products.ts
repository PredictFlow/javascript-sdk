import { BaseResource } from '../core/base-resource';
import { QueryParams } from '../core/request-builder';
import {
  Product,
  ProductListParams,
  ProductListResponse,
  LowStockResponse,
  InventoryHealthResponse,
  ABCAnalysisResponse,
  ProductCostUpdateInput,
  MarginResponse,
  InventorySnapshot,
  GetInventoryHistoryOptions,
  GetForecastHistoryOptions,
} from '../types/products.types';
import { Prediction } from '../types/predictions.types';

export class ProductsResource extends BaseResource {
  /**
   * List products with pagination and filters.
   */
  async list(params?: ProductListParams): Promise<ProductListResponse> {
    return this.http.get<ProductListResponse>('/products', {
      query: params as unknown as QueryParams,
    });
  }

  /**
   * Get single product details by product ID.
   */
  async get(productId: string): Promise<Product> {
    return this.http.get<Product>(`/products/${productId}`);
  }

  /**
   * Get products that are low in stock for a given store.
   */
  async listLowStock(storeId: string, options?: { threshold?: number }): Promise<LowStockResponse> {
    return this.http.get<LowStockResponse>(`/products/store/${storeId}/low-stock`, {
      query: options as unknown as QueryParams,
    });
  }

  /**
   * Get overall inventory health metrics for a store.
   */
  async getInventoryHealth(storeId: string, options?: { threshold?: number; overstock_threshold?: number }): Promise<InventoryHealthResponse> {
    return this.http.get<InventoryHealthResponse>(`/products/store/${storeId}/inventory-health`, {
      query: options as unknown as QueryParams,
    });
  }

  /**
   * Get ABC revenue analysis categorizing products by sales impact.
   */
  async getAbcAnalysis(storeId: string, options?: { days?: number }): Promise<ABCAnalysisResponse> {
    return this.http.get<ABCAnalysisResponse>(`/products/store/${storeId}/abc-analysis`, {
      query: options as unknown as QueryParams,
    });
  }

  /**
   * Get top selling products for a store.
   */
  async getTopSellers(storeId: string, options?: { days?: number; limit?: number; by?: 'revenue' | 'units' }): Promise<{ period_days: number; items: Record<string, unknown>[] }> {
    return this.http.get<{ period_days: number; items: Record<string, unknown>[] }>(`/products/store/${storeId}/top-sellers`, {
      query: options as unknown as QueryParams,
    });
  }

  /**
   * Get historical inventory level snapshots for a product.
   */
  async getInventoryHistory(productId: string, options?: GetInventoryHistoryOptions): Promise<InventorySnapshot[]> {
    return this.http.get<InventorySnapshot[]>(`/products/${productId}/inventory-history`, {
      query: options as unknown as QueryParams,
    });
  }

  /**
   * Get historical generated forecasts for a product.
   */
  async getForecastHistory(productId: string, options?: GetForecastHistoryOptions): Promise<Prediction[]> {
    return this.http.get<Prediction[]>(`/products/${productId}/forecast-history`, {
      query: options as unknown as QueryParams,
    });
  }

  /**
   * Update product cost price for margin calculation.
   */
  async updateCost(productId: string, data: ProductCostUpdateInput): Promise<MarginResponse> {
    return this.http.patch<MarginResponse>(`/products/${productId}/cost`, data);
  }

  /**
   * Get profit margin analysis for a product.
   */
  async getMargin(productId: string): Promise<MarginResponse> {
    return this.http.get<MarginResponse>(`/products/${productId}/margin`);
  }
}
