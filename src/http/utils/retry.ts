import { HttpError } from '../errors';

export interface RetryConfig {
  maxRetries?: number;
  delay?: number;
  exponential?: boolean;
  retryStatusCodes?: number[];
  shouldRetry?: (error: HttpError, attempt: number) => boolean;
}

const DEFAULTS = {
  maxRetries: 3,
  delay: 1000,
  exponential: true,
  retryStatusCodes: [408, 429, 500, 502, 503, 504],
  shouldRetry: () => true,
};

export async function withRetry<T>(
  fn: () => Promise<T>,
  config?: RetryConfig,
): Promise<T> {
  const { maxRetries, delay, exponential, retryStatusCodes, shouldRetry } = {
    ...DEFAULTS,
    ...config,
  };

  let lastError: Error | undefined;
  let attempt = 0;

  while (attempt <= maxRetries) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      attempt++;

      if (attempt > maxRetries) break;

      if (HttpError.isHttpError(error)) {
        if (error.status && !retryStatusCodes.includes(error.status)) break;
        if (!shouldRetry(error, attempt)) break;
      }

      const wait = exponential ? delay * Math.pow(2, attempt - 1) : delay;
      await sleep(Math.min(wait, 30_000));
    }
  }

  throw lastError ?? new Error('Retry failed');
}

export const sleep = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));
