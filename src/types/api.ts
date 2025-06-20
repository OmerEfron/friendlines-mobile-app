export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  pagination?: ApiPagination;
}

export interface ApiError {
  code: number;
  message: string;
  errors: string[];
  timestamp: string;
}

export interface ApiPagination {
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface RequestConfig {
  timeout?: number;
  headers?: Record<string, string>;
}
