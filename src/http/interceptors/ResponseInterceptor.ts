import type { ErrorInterceptorFn, HttpResponse, ResponseInterceptorFn } from '../types';
import { HttpError } from '../errors';

export function createLoggingInterceptor(): ResponseInterceptorFn {
  return (response: HttpResponse): HttpResponse => {
    const { config, status } = response;
    const duration = config.metadata?.startTime
      ? Date.now() - config.metadata.startTime
      : null;

    console.log(
      `[HTTP] ${config.method ?? 'GET'} ${config.url} → ${status}${duration !== null ? ` (${duration}ms)` : ''}`,
    );
    return response;
  };
}

export function createErrorLoggingInterceptor(): ErrorInterceptorFn {
  return (error: Error): Error => {
    if (HttpError.isHttpError(error) && error.config) {
      console.error(
        `[HTTP] ❌ ${error.config.method ?? 'GET'} ${error.config.url} → ${error.status ?? 'ERR'}: ${error.message}`,
      );
    } else {
      console.error('[HTTP] ❌ Error:', error.message);
    }
    return error;
  };
}

export function createResponseInterceptors(): {
  fulfilled: ResponseInterceptorFn[];
  rejected: ErrorInterceptorFn[];
} {
  if (__DEV__) {
    return {
      fulfilled: [createLoggingInterceptor()],
      rejected: [createErrorLoggingInterceptor()],
    };
  }
  return { fulfilled: [], rejected: [] };
}
