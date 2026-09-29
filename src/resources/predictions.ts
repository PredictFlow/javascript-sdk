import { BaseResource } from '../core/base-resource';
import {
  Prediction,
  ProductForecastRequest,
  StoreForecastRequest,
  ForecastBatchResponse,
  SimulationResponse,
  StockoutResponse,
  InventoryRecommendationResponse,
  PolicyOptimizationResponse,
} from '../types/predictions.types';

export class PredictionsResource extends BaseResource {
  /**
   * Generate an AI-driven demand forecast for a single product.
   */
  async forecastProduct(productId: string, options?: ProductForecastRequest): Promise<Prediction> {
    return this.http.post<Prediction>(`/products/${productId}/forecast`, undefined, {
      query: options as Record<string, string | number | undefined>,
    });
  }

  /**
   * Batch generate demand forecasts for all products in a store.
   */
  async forecastStore(storeId: string, options?: StoreForecastRequest): Promise<ForecastBatchResponse> {
    return this.http.post<ForecastBatchResponse>(`/products/store/${storeId}/forecast`, undefined, {
      query: options as Record<string, string | number | undefined>,
    });
  }

  /**
   * Run Monte Carlo demand simulations around an existing forecast.
   */
  async simulate(
    predictionId: string,
    options?: { n_simulations?: number; distribution?: 'poisson' | 'negative_binomial' | 'normal' }
  ): Promise<SimulationResponse> {
    return this.http.post<SimulationResponse>(`/predictions/${predictionId}/simulate`, undefined, {
      query: options,
    });
  }

  /**
   * Simulate stockout probability and days until stockout for a prediction.
   */
  async simulateStockout(
    predictionId: string,
    options?: { current_stock?: number }
  ): Promise<StockoutResponse> {
    return this.http.post<StockoutResponse>(`/predictions/${predictionId}/stockout`, undefined, {
      query: options,
    });
  }

  /**
   * Get intelligent inventory reorder recommendations (optimal quantity, reorder point, urgency).
   */
  async getInventoryRecommendation(
    predictionId: string,
    options?: { current_stock?: number; lead_time_days?: number; target_service_level?: number }
  ): Promise<InventoryRecommendationResponse> {
    return this.http.post<InventoryRecommendationResponse>(
      `/predictions/${predictionId}/inventory-recommendation`,
      undefined,
      { query: options }
    );
  }

  /**
   * Optimize stock holding policy balancing holding costs and stockout risk.
   */
  async optimizePolicy(
    predictionId: string,
    options?: { current_stock?: number; lead_time_days?: number; target_service_level?: number }
  ): Promise<PolicyOptimizationResponse> {
    return this.http.post<PolicyOptimizationResponse>(
      `/predictions/${predictionId}/optimize-policy`,
      undefined,
      { query: options }
    );
  }

  /**
   * Backtest and evaluate historical accuracy metrics for a prediction.
   */
  async evaluate(predictionId: string): Promise<Prediction> {
    return this.http.post<Prediction>(`/predictions/${predictionId}/evaluate`);
  }
}
