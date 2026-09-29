import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HttpClient } from '../../src/core/http-client';
import { resolveConfig } from '../../src/config';
import {
  StoresResource,
  ProductsResource,
  PredictionsResource,
  AnalyticsResource,
  PricingResource,
  ScenariosResource,
  AlertsResource,
  ExportsResource,
} from '../../src/resources';

describe('Domain Resources Integration', () => {
  let mockFetch: ReturnType<typeof vi.fn>;
  let http: HttpClient;

  beforeEach(() => {
    mockFetch = vi.fn();
    const config = resolveConfig({
      apiKey: 'pf_test_key_abc',
      baseUrl: 'https://api.predictflow.test/v1',
      fetch: mockFetch as unknown as typeof fetch,
      maxRetries: 0,
    });
    http = new HttpClient(config);
  });

  it('StoresResource should list and create stores', async () => {
    const storesResource = new StoresResource(http);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => [
        { id: 'store_1', platform: 'shopify', name: 'My Brand', store_url: 'brand.myshopify.com' },
      ],
    });

    const stores = await storesResource.list();
    expect(stores).toHaveLength(1);
    expect(stores[0].name).toBe('My Brand');
    expect(mockFetch.mock.calls[0][0]).toBe('https://api.predictflow.test/v1/stores');
  });

  it('ProductsResource should get low-stock products', async () => {
    const productsResource = new ProductsResource(http);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ threshold: 10, items: [{ id: 'prod_1', sku: 'SKU-101', stock_quantity: 4 }] }),
    });

    const lowStock = await productsResource.listLowStock('store_1');
    expect(lowStock.items).toHaveLength(1);
    expect(lowStock.items[0].sku).toBe('SKU-101');
    expect(mockFetch.mock.calls[0][0]).toBe('https://api.predictflow.test/v1/products/store/store_1/low-stock');
  });

  it('PredictionsResource should forecast product demand', async () => {
    const predictionsResource = new PredictionsResource(http);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        id: 'pred_1',
        product_id: 'prod_99',
        horizon_days: 30,
        forecast_data: { total_forecasted_units: 420 },
      }),
    });

    const prediction = await predictionsResource.forecastProduct('prod_99', { horizon_days: 30 });
    expect(prediction.id).toBe('pred_1');
    expect(prediction.forecast_data.total_forecasted_units).toBe(420);
    expect(mockFetch.mock.calls[0][0]).toBe('https://api.predictflow.test/v1/products/prod_99/forecast');
  });

  it('AnalyticsResource should get KPIs with period filtering', async () => {
    const analyticsResource = new AnalyticsResource(http);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        period_days: 30,
        current: { total_revenue: 54000, total_orders: 1200 },
        growth: { revenue_growth: 15.4 },
      }),
    });

    const kpis = await analyticsResource.getKpis({ period_days: 30, store_id: 'store_1' });
    expect(kpis.period_days).toBe(30);
    expect(kpis.current.total_revenue).toBe(54000);
    expect(mockFetch.mock.calls[0][0]).toBe('https://api.predictflow.test/v1/analytics/kpis?period_days=30&store_id=store_1');
  });

  it('PricingResource should fetch price elasticity', async () => {
    const pricingResource = new PricingResource(http);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        product_id: 'prod_99',
        elasticity_coefficient: -1.8,
        elasticity_category: 'elastic',
        optimal_price: 39.99,
      }),
    });

    const elasticity = await pricingResource.getElasticity('prod_99');
    expect(elasticity.elasticity_category).toBe('elastic');
    expect(elasticity.optimal_price).toBe(39.99);
  });

  it('ScenariosResource should create and simulate scenario', async () => {
    const scenariosResource = new ScenariosResource(http);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        id: 'scen_1',
        store_id: 'store_1',
        name: 'Black Friday 20% Off',
        status: 'draft',
      }),
    });

    const scenario = await scenariosResource.create('store_1', {
      name: 'Black Friday 20% Off',
      parameters: { price_change_pct: -20 },
    });

    expect(scenario.id).toBe('scen_1');
    expect(scenario.name).toBe('Black Friday 20% Off');
  });

  it('AlertsResource should list action feed', async () => {
    const alertsResource = new AlertsResource(http);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => [
        { id: 'act_1', type: 'reorder', title: 'Reorder SKU-101 immediately', impact_score: 95 },
      ],
    });

    const actionFeed = await alertsResource.getActionFeed('store_1');
    expect(actionFeed).toHaveLength(1);
    expect(actionFeed[0].impact_score).toBe(95);
  });

  it('ExportsResource should trigger product catalog export', async () => {
    const exportsResource = new ExportsResource(http);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        job_id: 'exp_123',
        status: 'completed',
        download_url: 'https://cdn.predictflow.com/exports/products.csv',
        format: 'csv',
      }),
    });

    const exportJob = await exportsResource.exportProducts('store_1', 'csv');
    expect(exportJob.job_id).toBe('exp_123');
    expect(exportJob.format).toBe('csv');
  });
});
