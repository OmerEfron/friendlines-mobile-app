import { ApiError } from '../types/api';

class ErrorService {
  logError(error: ApiError | Error): void {
    if (__DEV__) {
      console.error('API Error:', error);
    }

    // In production, you would send errors to a service like Sentry
    // For now, we'll just log to console in development
  }

  logNetworkError(error: any): void {
    if (__DEV__) {
      console.error('Network Error:', {
        message: error.message,
        code: error.code,
        stack: error.stack,
      });
    }
  }

  formatErrorMessage(error: ApiError): string {
    if (error.errors && error.errors.length > 0) {
      return error.errors.join(', ');
    }
    return error.message || 'An unexpected error occurred';
  }

  isNetworkError(error: any): boolean {
    return error.code === 0 || error.code === 'NETWORK_ERROR';
  }

  isValidationError(error: ApiError): boolean {
    return error.code === 400 && error.errors && error.errors.length > 0;
  }

  isAuthError(error: ApiError): boolean {
    return error.code === 401 || error.code === 403;
  }

  isRateLimitError(error: ApiError): boolean {
    return error.code === 429;
  }

  isServerError(error: ApiError): boolean {
    return error.code >= 500;
  }
}

export const errorService = new ErrorService();
export default errorService;
