import { HttpClient } from './http-client';

/**
 * Base class that all domain resource modules inherit from.
 * Provides access to the underlying HttpClient instance.
 */
export abstract class BaseResource {
  protected readonly http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }
}
