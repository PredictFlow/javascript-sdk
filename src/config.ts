/**
 * PredictFlow Client Configuration
 */

export interface ClientOptions {
  /**
   * PredictFlow API Key or Personal Access Token.
   * Can also be supplied via the `PREDICTFLOW_API_KEY` environment variable.
   */
  apiKey?: string;

  /**
   * The base URL for the PredictFlow API.
   * @default 'https://api.predictflow.com/v1'
   */
  baseUrl?: string;

  /**
   * Maximum request timeout in milliseconds.
   * @default 30000 (30 seconds)
   */
  timeoutMs?: number;

  /**
   * Maximum number of automatic retries on network failures or 5xx / 429 status codes.
   * @default 2
   */
  maxRetries?: number;

  /**
   * Custom HTTP headers to include with every request.
   */
  defaultHeaders?: Record<string, string>;

  /**
   * Optional custom `fetch` implementation for edge runtimes or testing mocks.
   */
  fetch?: typeof fetch;
}

export interface ResolvedClientConfig {
  apiKey: string;
  baseUrl: string;
  timeoutMs: number;
  maxRetries: number;
  defaultHeaders: Record<string, string>;
  fetch: typeof fetch;
}

export const DEFAULT_BASE_URL = 'https://api.predictflow.com/v1';
export const DEFAULT_TIMEOUT_MS = 30000;
export const DEFAULT_MAX_RETRIES = 2;

/**
 * Resolves user-provided options into a complete, sanitized configuration.
 */
export function resolveConfig(options: ClientOptions = {}): ResolvedClientConfig {
  let envApiKey = '';
  if (typeof process !== 'undefined' && process.env) {
    envApiKey = process.env.PREDICTFLOW_API_KEY || '';
  }

  const apiKey = options.apiKey || envApiKey;

  // Normalize baseUrl to remove trailing slash
  const rawBaseUrl = options.baseUrl || DEFAULT_BASE_URL;
  const baseUrl = rawBaseUrl.replace(/\/+$/, '');

  const globalFetch = typeof fetch !== 'undefined' ? fetch : undefined;
  const fetchImpl = options.fetch || globalFetch;

  if (!fetchImpl) {
    throw new Error('A global fetch implementation is required. Please provide a custom fetch in options or use Node 18+.');
  }

  return {
    apiKey,
    baseUrl,
    timeoutMs: options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
    maxRetries: options.maxRetries ?? DEFAULT_MAX_RETRIES,
    defaultHeaders: options.defaultHeaders ?? {},
    fetch: fetchImpl,
  };
}
