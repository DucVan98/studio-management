import type { RequestConfig } from '../types';

export function buildRequestUrl(config: RequestConfig): string {
  const base = config.baseURL?.endsWith('/')
    ? config.baseURL.slice(0, -1)
    : (config.baseURL ?? '');

  const path = config.url.startsWith('/') ? config.url : `/${config.url}`;
  let url = config.url.startsWith('http') ? config.url : `${base}${path}`;

  if (config.params) {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(config.params)) {
      if (value !== undefined && value !== null) {
        search.append(key, String(value));
      }
    }
    const qs = search.toString();
    if (qs) url += `?${qs}`;
  }

  return url;
}

export function normalizeConfig(
  config: RequestConfig,
  defaults: { baseURL: string; headers: Record<string, string>; timeout: number },
): RequestConfig {
  return {
    ...config,
    baseURL: config.baseURL ?? defaults.baseURL,
    headers: { ...defaults.headers, ...config.headers },
    timeout: config.timeout ?? defaults.timeout,
    method: config.method ?? 'GET',
  };
}

export function prepareHeaders(
  headers: Record<string, string>,
  data?: unknown,
): Record<string, string> {
  const result = { ...headers };
  // FormData: để fetch tự set multipart boundary — phải xoá Content-Type
  if (data instanceof FormData) {
    delete result['Content-Type'];
    return result;
  }
  if (data !== undefined && data !== null && !result['Content-Type']) {
    result['Content-Type'] = 'application/json';
  }
  return result;
}

export function serializeBody(
  data?: unknown,
  contentType?: string,
): string | FormData | undefined {
  if (data === undefined || data === null) return undefined;
  if (data instanceof FormData) return data;
  if (typeof data === 'string') return data;
  if (!contentType || contentType.includes('application/json')) {
    return JSON.stringify(data);
  }
  return String(data);
}
