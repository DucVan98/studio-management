import type { AuthInterceptorOptions, RequestConfig, RequestInterceptorFn } from '../types';

// ── Timing ────────────────────────────────────────────────────────────────────
export function createTimingInterceptor(): RequestInterceptorFn {
  return (config: RequestConfig): RequestConfig => ({
    ...config,
    metadata: { ...config.metadata, startTime: Date.now() },
  });
}

// ── Request ID ────────────────────────────────────────────────────────────────
export function createRequestIdInterceptor(
  headerName = 'X-Request-ID',
): RequestInterceptorFn {
  return (config: RequestConfig): RequestConfig => {
    const requestId = crypto.randomUUID();
    return {
      ...config,
      headers: { ...config.headers, [headerName]: requestId },
      metadata: { ...config.metadata, requestId },
    };
  };
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export function createAuthInterceptor(
  options: AuthInterceptorOptions,
): RequestInterceptorFn {
  const {
    getToken,
    tokenType = 'Bearer',
    headerName = 'Authorization',
    excludeUrls = [],
  } = options;

  const shouldExclude = (url: string) =>
    excludeUrls.some(p =>
      typeof p === 'string' ? url.includes(p) : p.test(url),
    );

  return async (config: RequestConfig): Promise<RequestConfig> => {
    if (shouldExclude(config.url)) return config;

    const token = await Promise.resolve(getToken());
    if (!token) return config;

    return {
      ...config,
      headers: {
        ...config.headers,
        [headerName]: tokenType ? `${tokenType} ${token}` : token,
      },
    };
  };
}

// ── Factory ───────────────────────────────────────────────────────────────────
export interface RequestInterceptorConfig {
  timing?: boolean;
  requestId?: boolean;
  auth?: AuthInterceptorOptions;
}

export function createRequestInterceptors(
  config: RequestInterceptorConfig,
): RequestInterceptorFn[] {
  const fns: RequestInterceptorFn[] = [];
  if (config.timing !== false) fns.push(createTimingInterceptor());
  if (config.requestId !== false) fns.push(createRequestIdInterceptor());
  if (config.auth) fns.push(createAuthInterceptor(config.auth));
  return fns;
}
