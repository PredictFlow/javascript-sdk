import { describe, it, expect, vi } from 'vitest';
import { PredictFlow } from '../../src/client';
import {
  StoresResource,
  ProductsResource,
  PredictionsResource,
  AnalyticsResource,
  PricingResource,
  ScenariosResource,
  AlertsResource,
  ExportsResource,
  WebhooksResource,
} from '../../src/resources';

describe('PredictFlow Client Initialization', () => {
  it('should instantiate with a string API key', () => {
    const client = new PredictFlow('pf_test_key_123');
    expect(client.config.apiKey).toBe('pf_test_key_123');
    expect(client.config.baseUrl).toBe('https://api.predictflow.com/v1');
    expect(client.config.timeoutMs).toBe(30000);
    expect(client.config.maxRetries).toBe(2);
  });

  it('should instantiate with full options object', () => {
    const customFetch = vi.fn();
    const client = new PredictFlow({
      apiKey: 'pf_custom_key',
      baseUrl: 'https://staging.predictflow.com/v1/',
      timeoutMs: 15000,
      maxRetries: 4,
      fetch: customFetch as unknown as typeof fetch,
      defaultHeaders: { 'X-Custom-Tenant': 'tenant_abc' },
    });

    expect(client.config.apiKey).toBe('pf_custom_key');
    // Trailing slash should be stripped
    expect(client.config.baseUrl).toBe('https://staging.predictflow.com/v1');
    expect(client.config.timeoutMs).toBe(15000);
    expect(client.config.maxRetries).toBe(4);
    expect(client.config.defaultHeaders).toEqual({ 'X-Custom-Tenant': 'tenant_abc' });
  });

  it('should correctly attach all domain resource instances', () => {
    const client = new PredictFlow('pf_test');

    expect(client.stores).toBeInstanceOf(StoresResource);
    expect(client.products).toBeInstanceOf(ProductsResource);
    expect(client.predictions).toBeInstanceOf(PredictionsResource);
    expect(client.analytics).toBeInstanceOf(AnalyticsResource);
    expect(client.pricing).toBeInstanceOf(PricingResource);
    expect(client.scenarios).toBeInstanceOf(ScenariosResource);
    expect(client.alerts).toBeInstanceOf(AlertsResource);
    expect(client.exports).toBeInstanceOf(ExportsResource);
    expect(client.webhooks).toBeInstanceOf(WebhooksResource);
  });

  it('should call health check endpoint', async () => {
    const mockFetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ status: 'healthy' }),
    });

    const client = new PredictFlow({
      apiKey: 'pf_test',
      fetch: mockFetch as unknown as typeof fetch,
    });

    const result = await client.health();
    expect(result).toEqual({ status: 'healthy' });
    expect(mockFetch.mock.calls[0][0]).toBe('https://api.predictflow.com/v1/health');
  });
});
