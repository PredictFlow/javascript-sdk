/**
 * Common Types and Interfaces for PredictFlow SDK
 */

export interface PaginationParams {
  page?: number;
  limit?: number;
  skip?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface DateRangeFilter {
  startDate?: string;
  endDate?: string;
}

export interface MessageResponse {
  message: string;
  success?: boolean;
}

export interface StatusResponse {
  status: string;
  message?: string;
}
