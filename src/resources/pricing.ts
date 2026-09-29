import { BaseResource } from '../core/base-resource';
import {
  PriceElasticityResponse,
  PriceOptimizationRequest,
  PriceOptimizationResponse,
  PriceSimulationRequest,
  PriceSimulationResponse,
  CompetitorPrice,
  CompetitorPriceInput,
  RepriceSuggestion,
} from '../types/pricing.types';
import { MessageResponse } from '../types/common';

export class PricingResource extends BaseResource {
  /**
   * Get price elasticity analysis and sensitivity curve for a product.
   */
  async getElasticity(productId: string): Promise<PriceElasticityResponse> {
    return this.http.get<PriceElasticityResponse>(`/pricing/product/${productId}/elasticity`);
  }

  /**
   * Calculate optimal price point maximizing target metric (revenue, profit, or units).
   */
  async optimize(productId: string, options?: PriceOptimizationRequest): Promise<PriceOptimizationResponse> {
    return this.http.post<PriceOptimizationResponse>(`/pricing/product/${productId}/optimize`, options);
  }

  /**
   * Simulate the impact of a hypothetical price change on product demand and profit.
   */
  async simulate(productId: string, params: PriceSimulationRequest): Promise<PriceSimulationResponse> {
    return this.http.post<PriceSimulationResponse>(`/pricing/product/${productId}/simulate`, params);
  }

  /**
   * Batch optimize prices for all active products in a store.
   */
  async batchOptimize(storeId: string, options?: PriceOptimizationRequest): Promise<PriceOptimizationResponse[]> {
    return this.http.post<PriceOptimizationResponse[]>(`/pricing/store/${storeId}/batch-optimize`, options);
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
  async deleteCompetitorPrice(productId: string, competitorPriceId: string): Promise<MessageResponse> {
    return this.http.delete<MessageResponse>(`/products/${productId}/competitor-prices/${competitorPriceId}`);
  }

  /**
   * Get intelligent repricing suggestion based on competitor movements.
   */
  async getRepriceSuggestion(productId: string): Promise<RepriceSuggestion> {
    return this.http.get<RepriceSuggestion>(`/products/${productId}/competitor-prices/reprice-suggestion`);
  }
}
