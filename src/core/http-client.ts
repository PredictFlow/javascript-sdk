import { ResolvedClientConfig } from '../config';
import { ConnectionError, createErrorFromResponse, PredictFlowError, TimeoutError } from './errors';
import { buildUrl, QueryParams } from './request-builder';

export interface RequestOptions {
  query?: QueryParams;
  headers?: Record<string, string>;
  timeoutMs?: number;
  maxRetries?: number;
  signal?: AbortSignal;
}

export class HttpClient {
  private readonly config: ResolvedClientConfig;

  constructor(config: ResolvedClientConfig) {
    this.config = config;
  }

  /**
   * Performs an HTTP GET request.
   */
  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('GET', path, undefined, options);
  }

  /**
   * Performs an HTTP POST request.
   */
  async post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('POST', path, body, options);
  }

  /**
   * Performs an HTTP PUT request.
   */
  async put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PUT', path, body, options);
  }

  /**
   * Performs an HTTP PATCH request.
   */
  async patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PATCH', path, body, options);
  }

  /**
   * Performs an HTTP DELETE request.
   */
  async delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('DELETE', path, undefined, options);
  }

  /**
   * Core request dispatcher with retry logic, timeouts, and typed error handling.
   */
  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    options: RequestOptions = {}
  ): Promise<T> {
    const url = buildUrl(this.config.baseUrl, path, options.query);
    const timeoutMs = options.timeoutMs ?? this.config.timeoutMs;

    // POST/PATCH aren't guaranteed idempotent - retrying one whose
    // response was lost after the server already processed it (a sync
    // trigger, a CSV import, a forecast run) risks duplicate side
    // effects, with no idempotency-key mechanism to protect against it.
    // GET/PUT/DELETE are safe to retry by default; a caller who knows a
    // specific POST/PATCH endpoint is safe can still opt in by passing
    // maxRetries explicitly on that call.
    const isIdempotentMethod = method === 'GET' || method === 'PUT' || method === 'DELETE';
    const maxRetries = options.maxRetries ?? (isIdempotentMethod ? this.config.maxRetries : 0);

    const headers: Record<string, string> = {
      Accept: 'application/json',
      'User-Agent': '@predictflow/sdk',
      ...this.config.defaultHeaders,
      ...options.headers,
    };

    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    let serializedBody: BodyInit | undefined;
    if (body !== undefined) {
      if (typeof FormData !== 'undefined' && body instanceof FormData) {
        serializedBody = body;
      } else if (typeof body === 'string') {
        headers['Content-Type'] = 'application/json';
        serializedBody = body;
      } else {
        headers['Content-Type'] = 'application/json';
        serializedBody = JSON.stringify(body);
      }
    }

    // Registered once, outside the retry loop, against whichever
    // attempt's controller is currently live - attaching a fresh
    // listener to the caller's signal on every retry would leak one
    // listener per attempt for the lifetime of the request.
    let currentController: AbortController | undefined;
    if (options.signal) {
      options.signal.addEventListener('abort', () => currentController?.abort(), { once: true });
    }

    let attempt = 0;
    while (true) {
      attempt++;
      const controller = new AbortController();
      currentController = controller;
      let timer: NodeJS.Timeout | undefined;

      if (timeoutMs > 0) {
        timer = setTimeout(() => controller.abort(), timeoutMs);
      }

      try {
        const response = await this.config.fetch(url, {
          method,
          headers,
          body: serializedBody,
          signal: controller.signal,
        });

        if (timer) clearTimeout(timer);

        // Check if retry is appropriate for 429 or 5xx server errors
        if (this.shouldRetryStatus(response.status) && attempt <= maxRetries) {
          const retryAfter = response.headers?.get('retry-after');
          const delay = this.calculateBackoff(attempt, retryAfter);
          await this.sleep(delay);
          continue;
        }

        const requestId = response.headers?.get('x-request-id') || undefined;

        // Parse response body
        let parsedData: unknown = null;
        const contentType = response.headers?.get('content-type') || '';
        if (response.status !== 204 && contentType.includes('application/json')) {
          try {
            parsedData = await response.json();
          } catch {
            parsedData = null;
          }
        } else if (response.status !== 204) {
          try {
            parsedData = await response.text();
          } catch {
            parsedData = null;
          }
        }

        if (!response.ok) {
          const retryAfter = response.headers?.get('retry-after');
          throw createErrorFromResponse(response.status, parsedData, requestId, retryAfter);
        }

        return parsedData as T;
      } catch (err: unknown) {
        if (timer) clearTimeout(timer);

        if (err instanceof PredictFlowError) {
          throw err;
        }

        const error = err as Error;

        if (error.name === 'AbortError' || controller.signal.aborted) {
          if (options.signal?.aborted) {
            throw new PredictFlowError({ message: 'Request was cancelled by caller' });
          }
          throw new TimeoutError(`Request timed out after ${timeoutMs}ms`);
        }

        // Retry network failures
        if (attempt <= maxRetries) {
          const delay = this.calculateBackoff(attempt);
          await this.sleep(delay);
          continue;
        }

        throw new ConnectionError(error.message || 'Network request failed', error);
      }
    }
  }

  private shouldRetryStatus(status: number): boolean {
    return status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
  }

  private calculateBackoff(attempt: number, retryAfterHeader?: string | null): number {
    if (retryAfterHeader) {
      const parsedSeconds = parseInt(retryAfterHeader, 10);
      if (!isNaN(parsedSeconds) && parsedSeconds > 0) {
        return parsedSeconds * 1000;
      }
    }
    // Exponential backoff with jitter: 200ms, 400ms, 800ms... + [0-100ms]
    const baseDelay = Math.min(200 * Math.pow(2, attempt - 1), 4000);
    const jitter = Math.floor(Math.random() * 100);
    return baseDelay + jitter;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
