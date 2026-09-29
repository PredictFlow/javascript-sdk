/**
 * PredictFlow JavaScript & TypeScript SDK
 * Official SDK for integrating PredictFlow demand forecasting and inventory intelligence.
 */

export const SDK_VERSION = '0.1.0';

// Main Client
export { PredictFlow, default } from './client';

// Configuration
export {
  type ClientOptions,
  type ResolvedClientConfig,
  DEFAULT_BASE_URL,
  DEFAULT_TIMEOUT_MS,
  DEFAULT_MAX_RETRIES,
  resolveConfig,
} from './config';

// Core HTTP & Errors
export {
  PredictFlowError,
  AuthenticationError,
  NotFoundError,
  ValidationError,
  RateLimitError,
  InternalServerError,
  TimeoutError,
  ConnectionError,
  type PredictFlowErrorOptions,
} from './core/errors';

export { HttpClient, type RequestOptions } from './core/http-client';
export { BaseResource } from './core/base-resource';

// Resources
export * from './resources';

// Types
export * from './types';
