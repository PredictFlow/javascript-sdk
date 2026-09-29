import { BaseResource } from '../core/base-resource';
import {
  Prediction,
  ProductForecastRequest,
  StoreForecastRequest,
  StockoutSimulationRequest,
  StockoutSimulationResult,
  InventoryRecommendation,
  PolicyOptimizationResult,
} from '../types/predictions.types';

export class PredictionsResource extends BaseResource {
  /**
   * Generate an AI-driven demand forecast for a single product.
   */
  async forecastProduct(productId: string, options?: ProductForecastRequest): Promise<Prediction> {
    return this.http.post<Prediction>(`/products/${productId}/forecast`, options);
  }

  /**
   * Generate batch demand forecasts for multiple products across a store.
   */
  async forecastStore(storeId: string, options?: StoreForecastRequest): Promise<Prediction[]> {
    return this.http.post<Prediction[]>(`/products/store/${storeId}/forecast`, options);
  }

  /**
   * Run a stockout risk simulation on an existing prediction.
   */
  async simulateStockout(predictionId: string, params?: StockoutSimulationRequest): Promise<StockoutSimulationResult> {
    return this.http.post<StockoutSimulationResult>(`/predictions/${predictionId}/stockout`, params);
  }

  /**
   * Get intelligent inventory reorder recommendations (optimal quantity, reorder point).
   */
  async getInventoryRecommendation(predictionId: string): Promise<InventoryRecommendation> {
    return this.http.post<InventoryRecommendation>(`/predictions/${predictionId}/inventory-recommendation`);
  }

  /**
   * Optimize stock holding policy balancing holding costs and stockout risk.
   */
  async optimizePolicy(
    predictionId: string,
    options?: { target_service_level?: number }
  ): Promise<PolicyOptimizationResult> {
    return this.http.post<PolicyOptimizationResult>(`/predictions/${predictionId}/optimize-policy`, options);
  }

  /**
   * Evaluate historical accuracy metrics for a prediction.
   */
  async evaluate(predictionId: string): Promise<Record<string, unknown>> {
    return this.http.post<Record<string, unknown>>(`/predictions/${predictionId}/evaluate`);
  }
}
