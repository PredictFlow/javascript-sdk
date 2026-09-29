import { BaseResource } from '../core/base-resource';
import {
  Product,
  ProductListParams,
  ProductListResponse,
  LowStockResponse,
  InventoryHealthResponse,
  ABCAnalysisResponse,
  ProductCostUpdateInput,
  MarginResponse,
} from '../types/products.types';
import { Prediction } from '../types/predictions.types';

export class ProductsResource extends BaseResource {
  /**
   * List products with pagination and filters.
   */
  async list(params?: ProductListParams): Promise<ProductListResponse> {
    return this.http.get<ProductListResponse>('/products', {
      query: params as Record<string, string | number | undefined>,
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
      query: options,
    });
  }

  /**
   * Get overall inventory health metrics for a store.
   */
  async getInventoryHealth(storeId: string, options?: { threshold?: number; overstock_threshold?: number }): Promise<InventoryHealthResponse> {
    return this.http.get<InventoryHealthResponse>(`/products/store/${storeId}/inventory-health`, {
      query: options,
    });
  }

  /**
   * Get ABC revenue analysis categorizing products by sales impact.
   */
  async getAbcAnalysis(storeId: string, options?: { days?: number }): Promise<ABCAnalysisResponse> {
    return this.http.get<ABCAnalysisResponse>(`/products/store/${storeId}/abc-analysis`, {
      query: options,
    });
  }

  /**
   * Get top selling products for a store.
   */
  async getTopSellers(storeId: string, options?: { days?: number; limit?: number; by?: 'revenue' | 'units' }): Promise<{ period_days: number; items: Record<string, unknown>[] }> {
    return this.http.get<{ period_days: number; items: Record<string, unknown>[] }>(`/products/store/${storeId}/top-sellers`, {
      query: options,
    });
  }

  /**
   * Get historical inventory level snapshots for a product.
   */
  async getInventoryHistory(productId: string): Promise<Record<string, unknown>[]> {
    return this.http.get<Record<string, unknown>[]>(`/products/${productId}/inventory-history`);
  }

  /**
   * Get historical generated forecasts for a product.
   */
  async getForecastHistory(productId: string): Promise<Prediction[]> {
    return this.http.get<Prediction[]>(`/products/${productId}/forecast-history`);
  }

  /**
   * Update product cost price for margin calculation.
   */
  async updateCost(productId: string, data: ProductCostUpdateInput): Promise<Product> {
    return this.http.patch<Product>(`/products/${productId}/cost`, data);
  }

  /**
   * Get profit margin analysis for a product.
   */
  async getMargin(productId: string): Promise<MarginResponse> {
    return this.http.get<MarginResponse>(`/products/${productId}/margin`);
  }
}
