// ============================================================================
// HTTP Client Types
// ============================================================================

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
export type HttpHeaders = Record<string, string>;
export type ResponseType = 'json' | 'text' | 'blob' | 'arraybuffer';

export interface RequestConfig<TData = unknown> {
  url: string;
  method?: HttpMethod;
  baseURL?: string;
  headers?: HttpHeaders;
  params?: Record<string, string | number | boolean | undefined>;
  data?: TData;
  timeout?: number;
  signal?: AbortSignal;
  responseType?: ResponseType;
  metadata?: RequestMetadata;
}

export interface RequestMetadata {
  startTime?: number;
  requestId?: string;
  retryCount?: number;
  tags?: Record<string, string>;
}

export interface HttpResponse<TData = unknown> {
  data: TData;
  status: number;
  statusText: string;
  headers: Headers;
  config: RequestConfig;
}

export interface HttpClientConfig {
  baseURL?: string;
  timeout?: number;
  headers?: HttpHeaders;
}

// ============================================================================
// Interceptor Types
// ============================================================================

export type RequestInterceptorFn = (
  config: RequestConfig,
) => RequestConfig | Promise<RequestConfig>;

export type ResponseInterceptorFn<T = unknown> = (
  response: HttpResponse<T>,
) => HttpResponse<T> | Promise<HttpResponse<T>>;

export type ErrorInterceptorFn = (error: Error) => Error | Promise<Error>;

export interface AuthInterceptorOptions {
  getToken: () => string | null | Promise<string | null>;
  tokenType?: string;
  headerName?: string;
  excludeUrls?: (string | RegExp)[];
}
