import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HttpClient } from '../../src/core/http-client';
import { resolveConfig } from '../../src/config';
import {
  AuthenticationError,
  NotFoundError,
  ValidationError,
  RateLimitError,
  InternalServerError,
  TimeoutError,
} from '../../src/core/errors';

describe('HttpClient', () => {
  const mockApiKey = 'pf_live_test_key_123';
  const mockBaseUrl = 'https://api.predictflow.test/v1';

  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
  });

  function createClient(options = {}) {
    const config = resolveConfig({
      apiKey: mockApiKey,
      baseUrl: mockBaseUrl,
      fetch: mockFetch as unknown as typeof fetch,
      maxRetries: 1,
      timeoutMs: 1000,
      ...options,
    });
    return new HttpClient(config);
  }

  it('should include Authorization and JSON headers on GET request', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ success: true }),
    });

    const client = createClient();
    const result = await client.get<{ success: boolean }>('/predictions/forecast', {
      query: { storeId: 'store_1', horizonDays: 30 },
    });

    expect(result).toEqual({ success: true });
    expect(mockFetch).toHaveBeenCalledTimes(1);

    const [calledUrl, calledOptions] = mockFetch.mock.calls[0];
    expect(calledUrl).toBe('https://api.predictflow.test/v1/predictions/forecast?storeId=store_1&horizonDays=30');
    expect(calledOptions.method).toBe('GET');
    expect(calledOptions.headers['Authorization']).toBe(`Bearer ${mockApiKey}`);
    expect(calledOptions.headers['Accept']).toBe('application/json');
  });

  it('should correctly format POST request with JSON body', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ id: 'pred_123', status: 'completed' }),
    });

    const client = createClient();
    const payload = { productId: 'prod_99', targetDate: '2026-10-01' };
    const result = await client.post('/predictions', payload);

    expect(result).toEqual({ id: 'pred_123', status: 'completed' });
    const [, calledOptions] = mockFetch.mock.calls[0];
    expect(calledOptions.method).toBe('POST');
    expect(calledOptions.headers['Content-Type']).toBe('application/json');
    expect(calledOptions.body).toBe(JSON.stringify(payload));
  });

  it('should throw AuthenticationError on 401 status', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ detail: 'Invalid or expired API key' }),
    });

    const client = createClient({ maxRetries: 0 });

    await expect(client.get('/predictions')).rejects.toThrow('Invalid or expired API key');
  });

  it('should throw NotFoundError on 404 status', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ detail: 'Store not found' }),
    });

    const client = createClient({ maxRetries: 0 });

    await expect(client.get('/stores/missing-id')).rejects.toThrow(NotFoundError);
  });

  it('should throw ValidationError on 422 status', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 422,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ detail: 'Invalid product_id parameter' }),
    });

    const client = createClient({ maxRetries: 0 });

    await expect(client.post('/predictions', {})).rejects.toThrow(ValidationError);
  });

  it('should retry on 429 rate limit and throw RateLimitError when retries exhausted', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 429,
      headers: new Headers({
        'content-type': 'application/json',
        'retry-after': '0',
      }),
      json: async () => ({ detail: 'Rate limit exceeded' }),
    });

    const client = createClient({ maxRetries: 1 });

    await expect(client.get('/predictions')).rejects.toThrow(RateLimitError);
    // 1 original attempt + 1 retry = 2 attempts
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('should retry on 500 internal server error and succeed on second attempt', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ detail: 'Temporary database failure' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ recovered: true }),
      });

    const client = createClient({ maxRetries: 2 });
    const result = await client.get<{ recovered: boolean }>('/health');

    expect(result).toEqual({ recovered: true });
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('should throw TimeoutError when request exceeds timeoutMs', async () => {
    // Simulate an aborted fetch
    mockFetch.mockImplementation(async (_url, { signal }) => {
      return new Promise((_resolve, reject) => {
        signal.addEventListener('abort', () => {
          const abortErr = new Error('The operation was aborted');
          abortErr.name = 'AbortError';
          reject(abortErr);
        });
      });
    });

    const client = createClient({ timeoutMs: 50, maxRetries: 0 });

    await expect(client.get('/slow-endpoint')).rejects.toThrow(TimeoutError);
  });
});
