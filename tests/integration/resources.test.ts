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
    expect(stores[0]!.name).toBe('My Brand');
    expect(mockFetch.mock.calls[0]![0]).toBe('https://api.predictflow.test/v1/stores');
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
    expect(lowStock.items[0]!.sku).toBe('SKU-101');
    expect(mockFetch.mock.calls[0]![0]).toBe('https://api.predictflow.test/v1/products/store/store_1/low-stock');
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
    expect(mockFetch.mock.calls[0]![0]).toBe('https://api.predictflow.test/v1/products/prod_99/forecast?horizon_days=30');
  });

  it('AnalyticsResource should get KPIs with period filtering', async () => {
    const analyticsResource = new AnalyticsResource(http);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        period_days: 30,
        current: { revenue: 54000, orders: 1200, aov: 45 },
        previous: { revenue: 47000, orders: 1100, aov: 42.72 },
        growth: { revenue_growth_pct: 15.4, orders_growth_pct: 9.1, aov_growth_pct: 5.3 },
        active_stores: 1,
        products_tracked: 10,
      }),
    });

    const kpis = await analyticsResource.getKpis({ days: 30, store_id: 'store_1' });
    expect(kpis.period_days).toBe(30);
    expect(kpis.current.revenue).toBe(54000);
    expect(mockFetch.mock.calls[0]![0]).toBe('https://api.predictflow.test/v1/analytics/kpis?days=30&store_id=store_1');
  });

  it('PricingResource should fetch price elasticity', async () => {
    const pricingResource = new PricingResource(http);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        product_id: 'prod_99',
        elasticity: -1.8,
        elasticity_type: 'elastic',
        interpretation: 'Demand is elastic',
      }),
    });

    const elasticity = await pricingResource.getElasticity('prod_99');
    expect(elasticity.elasticity_type).toBe('elastic');
    expect(elasticity.elasticity).toBe(-1.8);
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
        price_change_pct: -0.2,
      }),
    });

    const scenario = await scenariosResource.create('store_1', {
      name: 'Black Friday 20% Off',
      price_change_pct: -0.2,
    });

    expect(scenario.id).toBe('scen_1');
    expect(scenario.name).toBe('Black Friday 20% Off');
  });

  it('AlertsResource should list templates and rules', async () => {
    const alertsResource = new AlertsResource(http);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => [
        { metric_type: 'low_stock', name: 'Low Stock', default_threshold: 10, supports_product_scope: true },
      ],
    });

    const templates = await alertsResource.listTemplates();
    expect(templates).toHaveLength(1);
    expect(templates[0]!.metric_type).toBe('low_stock');
  });

  it('ExportsResource should trigger product catalog export', async () => {
    const exportsResource = new ExportsResource(http);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'text/csv' }),
      text: async () => 'SKU,Name,Price\nSKU-1,Product 1,29.99',
    });

    const csvContent = await exportsResource.exportProducts('store_1', { format: 'csv' });
    expect(csvContent).toContain('SKU,Name,Price');
  });
});
