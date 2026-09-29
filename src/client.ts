import { ClientOptions, resolveConfig, ResolvedClientConfig } from './config';
import { HttpClient } from './core/http-client';
import {
  StoresResource,
  ProductsResource,
  PredictionsResource,
  AnalyticsResource,
  PricingResource,
  ScenariosResource,
  AlertsResource,
  ExportsResource,
} from './resources';

/**
 * PredictFlow SDK Client
 * The unified entry point for interacting with the PredictFlow API.
 *
 * @example
 * ```typescript
 * import { PredictFlow } from '@predictflow/sdk';
 *
 * const predictFlow = new PredictFlow({
 *   apiKey: process.env.PREDICTFLOW_API_KEY,
 * });
 *
 * const forecast = await predictFlow.predictions.forecastProduct('prod_123', { horizon_days: 30 });
 * ```
 */
export class PredictFlow {
  /**
   * Underlying HTTP client managing requests, headers, timeouts, and retries.
   */
  readonly http: HttpClient;

  /**
   * Resolved client configuration.
   */
  readonly config: ResolvedClientConfig;

  /**
   * Store management, connection testing, and catalog/order syncing.
   */
  readonly stores: StoresResource;

  /**
   * Product catalog, inventory levels, ABC analysis, and stock health.
   */
  readonly products: ProductsResource;

  /**
   * AI-powered demand forecasting, stockout simulation, and inventory recommendations.
   */
  readonly predictions: PredictionsResource;

  /**
   * Sales KPIs, revenue trends, day-of-week analysis, and customer metrics.
   */
  readonly analytics: AnalyticsResource;

  /**
   * Price elasticity, price optimization, simulations, and competitor tracking.
   */
  readonly pricing: PricingResource;

  /**
   * What-if scenario planning, simulations, and side-by-side comparisons.
   */
  readonly scenarios: ScenariosResource;

  /**
   * Inventory alert rules, templates, history, and the intelligent action feed.
   */
  readonly alerts: AlertsResource;

  /**
   * CSV/JSON catalog and sales exports, and automated scheduled email reports.
   */
  readonly exports: ExportsResource;

  /**
   * Creates an instance of the PredictFlow client.
   *
   * @param options Client configuration options or API key string.
   */
  constructor(options: ClientOptions | string = {}) {
    const opts: ClientOptions = typeof options === 'string' ? { apiKey: options } : options;
    this.config = resolveConfig(opts);
    this.http = new HttpClient(this.config);

    this.stores = new StoresResource(this.http);
    this.products = new ProductsResource(this.http);
    this.predictions = new PredictionsResource(this.http);
    this.analytics = new AnalyticsResource(this.http);
    this.pricing = new PricingResource(this.http);
    this.scenarios = new ScenariosResource(this.http);
    this.alerts = new AlertsResource(this.http);
    this.exports = new ExportsResource(this.http);
  }

  /**
   * Health check to verify API connectivity.
   */
  async health(): Promise<{ status: string }> {
    try {
      return await this.http.get<{ status: string }>('/health');
    } catch {
      // Fallback for root-level health route if baseUrl includes /api/v1
      const rootUrl = new URL(this.config.baseUrl).origin;
      const res = await this.config.fetch(`${rootUrl}/health`);
      if (res.ok) {
        return (await res.json()) as { status: string };
      }
      throw new Error(`Health check failed with status ${res.status}`);
    }
  }
}

export default PredictFlow;
