/**
 * PredictFlow SDK Errors
 * Comprehensive typed error hierarchy for predictable error handling.
 */

export interface PredictFlowErrorOptions {
  message: string;
  status?: number;
  code?: string;
  requestId?: string;
  details?: unknown;
  cause?: Error;
}

/**
 * Base error class for all errors originating from the PredictFlow SDK.
 */
export class PredictFlowError extends Error {
  readonly status?: number;
  readonly code?: string;
  readonly requestId?: string;
  readonly details?: unknown;

  constructor(options: PredictFlowErrorOptions) {
    super(options.message);
    this.name = 'PredictFlowError';
    this.status = options.status;
    this.code = options.code;
    this.requestId = options.requestId;
    this.details = options.details;
    if (options.cause) {
      this.cause = options.cause;
    }
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when authentication fails (401 Unauthorized or 403 Forbidden).
 */
export class AuthenticationError extends PredictFlowError {
  constructor(options: Omit<PredictFlowErrorOptions, 'name'>) {
    super(options);
    this.name = 'AuthenticationError';
  }
}

/**
 * Thrown when a requested resource is not found (404 Not Found).
 */
export class NotFoundError extends PredictFlowError {
  constructor(options: Omit<PredictFlowErrorOptions, 'name'>) {
    super(options);
    this.name = 'NotFoundError';
  }
}

/**
 * Thrown when request validation fails (422 Unprocessable Entity or 400 Bad Request).
 */
export class ValidationError extends PredictFlowError {
  constructor(options: Omit<PredictFlowErrorOptions, 'name'>) {
    super(options);
    this.name = 'ValidationError';
  }
}

/**
 * Thrown when the client exceeds the API rate limit (429 Too Many Requests).
 */
export class RateLimitError extends PredictFlowError {
  readonly retryAfterSeconds?: number;

  constructor(options: Omit<PredictFlowErrorOptions, 'name'> & { retryAfterSeconds?: number }) {
    super(options);
    this.name = 'RateLimitError';
    this.retryAfterSeconds = options.retryAfterSeconds;
  }
}

/**
 * Thrown when the PredictFlow server encounters an internal error (500, 502, 503, 504).
 */
export class InternalServerError extends PredictFlowError {
  constructor(options: Omit<PredictFlowErrorOptions, 'name'>) {
    super(options);
    this.name = 'InternalServerError';
  }
}

/**
 * Thrown when a network request times out.
 */
export class TimeoutError extends PredictFlowError {
  constructor(message = 'Request timed out') {
    super({ message, code: 'TIMEOUT' });
    this.name = 'TimeoutError';
  }
}

/**
 * Thrown when a connection cannot be established or network is unreachable.
 */
export class ConnectionError extends PredictFlowError {
  constructor(message: string, cause?: Error) {
    super({ message, code: 'CONNECTION_ERROR', cause });
    this.name = 'ConnectionError';
  }
}

/**
 * Maps an HTTP status code and response payload to the appropriate PredictFlowError subclass.
 */
export function createErrorFromResponse(
  status: number,
  body: unknown,
  requestId?: string,
  retryAfterHeader?: string | null
): PredictFlowError {
  let message = `API request failed with status ${status}`;
  let code: string | undefined;
  let details: unknown;

  if (body && typeof body === 'object') {
    const raw = body as Record<string, unknown>;
    if (typeof raw.detail === 'string') {
      message = raw.detail;
    } else if (typeof raw.message === 'string') {
      message = raw.message;
    } else if (raw.detail) {
      details = raw.detail;
    }

    if (typeof raw.code === 'string') {
      code = raw.code;
    }
  }

  const retryAfterSeconds = retryAfterHeader ? parseInt(retryAfterHeader, 10) || undefined : undefined;

  switch (status) {
    case 401:
    case 403:
      return new AuthenticationError({ message, status, code, requestId, details });
    case 404:
      return new NotFoundError({ message, status, code, requestId, details });
    case 400:
    case 422:
      return new ValidationError({ message, status, code, requestId, details });
    case 429:
      return new RateLimitError({ message, status, code, requestId, details, retryAfterSeconds });
    case 500:
    case 502:
    case 503:
    case 504:
      return new InternalServerError({ message, status, code, requestId, details });
    default:
      return new PredictFlowError({ message, status, code, requestId, details });
  }
}
