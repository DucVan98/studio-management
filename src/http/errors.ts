import type { RequestConfig } from './types';

export class HttpError extends Error {
  public readonly status?: number;
  public readonly statusText?: string;
  public readonly config?: RequestConfig;
  public readonly data?: unknown;

  constructor(
    message: string,
    options?: {
      status?: number;
      statusText?: string;
      config?: RequestConfig;
      data?: unknown;
    },
  ) {
    super(message);
    this.name = 'HttpError';
    this.status = options?.status;
    this.statusText = options?.statusText;
    this.config = options?.config;
    this.data = options?.data;
  }

  static isHttpError(error: unknown): error is HttpError {
    return error instanceof HttpError;
  }

  static async fromResponse(
    response: Response,
    config: RequestConfig,
  ): Promise<HttpError> {
    let data: unknown;
    try {
      data = await response.json();
    } catch {
      data = await response.text().catch(() => null);
    }

    const message =
      (data as Record<string, unknown>)?.message as string ??
      `HTTP ${response.status}: ${response.statusText}`;

    return new HttpError(message, {
      status: response.status,
      statusText: response.statusText,
      config,
      data,
    });
  }
}

export function createHttpError(error: unknown, config?: RequestConfig): HttpError {
  if (HttpError.isHttpError(error)) return error;

  const message = error instanceof Error ? error.message : String(error);
  return new HttpError(message, { config });
}
