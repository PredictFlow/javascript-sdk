import { BaseResource } from '../core/base-resource';
import { QueryParams } from '../core/request-builder';
import {
  ElasticityResponse,
  OptimizeResponse,
  SimulateResponse,
  BatchOptimizeItem,
  CrossElasticityResponse,
  CompetitorPrice,
  CompetitorPriceInput,
  RepriceSuggestionResponse,
  GetElasticityOptions,
  OptimizePriceOptions,
  SimulatePriceOptions,
  BatchOptimizeOptions,
  GetCrossElasticityOptions,
} from '../types/pricing.types';

export class PricingResource extends BaseResource {
  /**
   * Get price elasticity analysis and sensitivity curve for a product.
   */
  async getElasticity(productId: string, options?: GetElasticityOptions): Promise<ElasticityResponse> {
    return this.http.get<ElasticityResponse>(`/pricing/product/${productId}/elasticity`, {
      query: options as unknown as QueryParams,
    });
  }

  /**
   * Calculate optimal price point maximizing target metric (revenue, profit, or volume).
   */
  async optimize(productId: string, options?: OptimizePriceOptions): Promise<OptimizeResponse> {
    return this.http.post<OptimizeResponse>(`/pricing/product/${productId}/optimize`, undefined, {
      query: options as unknown as QueryParams,
    });
  }

  /**
   * Simulate the impact of a hypothetical price change on product demand and profit.
   */
  async simulate(productId: string, params: SimulatePriceOptions): Promise<SimulateResponse> {
    return this.http.post<SimulateResponse>(`/pricing/product/${productId}/simulate`, undefined, {
      query: params as unknown as QueryParams,
    });
  }

  /**
   * Batch optimize prices for all active products in a store.
   */
  async batchOptimize(storeId: string, options?: BatchOptimizeOptions): Promise<BatchOptimizeItem[]> {
    return this.http.post<BatchOptimizeItem[]>(`/pricing/store/${storeId}/batch-optimize`, undefined, {
      query: options as unknown as QueryParams,
    });
  }

  /**
   * Calculate cross-price elasticity between two products.
   */
  async getCrossElasticity(
    productId: string,
    relatedProductId: string,
    options?: GetCrossElasticityOptions
  ): Promise<CrossElasticityResponse> {
    return this.http.get<CrossElasticityResponse>(
      `/pricing/product/${productId}/cross-elasticity/${relatedProductId}`,
      {
        query: options as unknown as QueryParams,
      }
    );
  }

  /**
   * List competitor price tracking entries for a product.
   */
  async listCompetitorPrices(productId: string): Promise<CompetitorPrice[]> {
    return this.http.get<CompetitorPrice[]>(`/products/${productId}/competitor-prices`);
  }

  /**
   * Add a tracked competitor price for a product.
   */
  async addCompetitorPrice(productId: string, data: CompetitorPriceInput): Promise<CompetitorPrice> {
    return this.http.post<CompetitorPrice>(`/products/${productId}/competitor-prices`, data);
  }

  /**
   * Delete a tracked competitor price.
   */
  async deleteCompetitorPrice(productId: string, competitorPriceId: string): Promise<void> {
    return this.http.delete<void>(`/products/${productId}/competitor-prices/${competitorPriceId}`);
  }

  /**
   * Get intelligent repricing suggestion based on competitor movements.
   */
  async getRepriceSuggestion(productId: string): Promise<RepriceSuggestionResponse> {
    return this.http.get<RepriceSuggestionResponse>(`/products/${productId}/competitor-prices/reprice-suggestion`);
  }
}
