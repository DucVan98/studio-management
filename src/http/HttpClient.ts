import type {
  HttpClientConfig,
  HttpHeaders,
  HttpResponse,
  RequestConfig,
  RequestInterceptorFn,
  ResponseInterceptorFn,
  ErrorInterceptorFn,
} from './types';
import { HttpError, createHttpError } from './errors';
import { InterceptorManager } from './interceptors/InterceptorManager';
import {
  createRequestInterceptors,
  createResponseInterceptors,
} from './interceptors';
import {
  buildRequestUrl,
  normalizeConfig,
  prepareHeaders,
  serializeBody,
} from './utils/url';

const DEFAULT_TIMEOUT = 30_000;
const DEFAULT_HEADERS: HttpHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

function isSuccessStatus(status: number): boolean {
  return status >= 200 && status < 300;
}

async function parseResponse<T>(
  response: Response,
  config: RequestConfig,
): Promise<HttpResponse<T>> {
  const type = config.responseType ?? 'json';
  let data: T;

  if (type === 'text') {
    data = (await response.text()) as unknown as T;
  } else if (type === 'arraybuffer') {
    data = (await response.arrayBuffer()) as unknown as T;
  } else if (type === 'blob') {
    data = (await response.blob()) as unknown as T;
  } else {
    const text = await response.text();
    data = text ? (JSON.parse(text) as T) : ({} as T);
  }

  return {
    data,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
    config,
  };
}

function mergeAbortSignals(...signals: AbortSignal[]): AbortSignal {
  const controller = new AbortController();
  for (const signal of signals) {
    if (signal.aborted) { controller.abort(); break; }
    signal.addEventListener('abort', () => controller.abort());
  }
  return controller.signal;
}

// ============================================================================
// HttpClient
// ============================================================================

export class HttpClient {
  private readonly baseURL: string;
  private readonly timeout: number;
  private headers: HttpHeaders;

  private readonly requestInterceptors: InterceptorManager<RequestInterceptorFn>;
  private readonly responseInterceptors: InterceptorManager<ResponseInterceptorFn | undefined>;
  private readonly errorInterceptors: InterceptorManager<ErrorInterceptorFn>;

  constructor(config?: HttpClientConfig) {
    this.baseURL = config?.baseURL ?? '';
    this.timeout = config?.timeout ?? DEFAULT_TIMEOUT;
    this.headers = { ...DEFAULT_HEADERS, ...config?.headers };

    this.requestInterceptors = new InterceptorManager();
    this.responseInterceptors = new InterceptorManager();
    this.errorInterceptors = new InterceptorManager();

    this.setupDefaultInterceptors();
  }

  // ── Configuration ─────────────────────────────────────────────────────────

  get interceptors() {
    return {
      request: this.requestInterceptors,
      response: this.responseInterceptors,
      error: this.errorInterceptors,
    };
  }

  setHeaders(headers: HttpHeaders): void {
    this.headers = { ...this.headers, ...headers };
  }

  setAuthToken(token: string): void {
    this.headers['Authorization'] = `Bearer ${token}`;
  }

  clearAuthToken(): void {
    delete this.headers['Authorization'];
  }

  // ── Core Request ──────────────────────────────────────────────────────────

  async request<TResponse, TData = unknown>(
    config: RequestConfig<TData>,
  ): Promise<HttpResponse<TResponse>> {
    let normalized = normalizeConfig(config as RequestConfig, {
      baseURL: this.baseURL,
      headers: this.headers,
      timeout: this.timeout,
    });

    try {
      // Request interceptors
      for (const fn of this.requestInterceptors.getAll()) {
        normalized = await fn(normalized);
      }

      // Execute fetch
      const response = await this.executeRequest<TResponse>(normalized);

      // Response interceptors
      let processed: HttpResponse<TResponse> = response;
      for (const fn of this.responseInterceptors.getAll()) {
        if (fn) processed = (await fn(processed)) as HttpResponse<TResponse>;
      }

      return processed;
    } catch (error) {
      const httpError = createHttpError(error, normalized);

      // Error interceptors
      let processed: Error = httpError;
      for (const fn of this.errorInterceptors.getAll()) {
        processed = await fn(processed);
      }

      throw processed;
    }
  }

  private async executeRequest<TResponse>(
    config: RequestConfig,
  ): Promise<HttpResponse<TResponse>> {
    const url = buildRequestUrl(config);
    const method = config.method ?? 'GET';

    // Fail-fast: URL không tuyệt đối (thường do thiếu EXPO_PUBLIC_API_URL)
    // → fetch trên iOS có thể treo vô hạn thay vì reject. Ném lỗi ngay.
    if (!/^https?:\/\//i.test(url)) {
      throw createHttpError(
        new Error(`Invalid request URL "${url}" — kiểm tra EXPO_PUBLIC_API_URL trong .env`),
        config,
      );
    }

    const timeoutMs = config.timeout ?? this.timeout;
    const controller = new AbortController();
    // Timeout 2 lớp: abort fetch + reject cứng qua Promise.race
    // (phòng trường hợp native fetch không phản hồi AbortSignal).
    let raceTimerId: ReturnType<typeof setTimeout> | undefined;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    const hardTimeout = new Promise<never>((_, reject) => {
      raceTimerId = setTimeout(
        () => reject(createHttpError(new Error(`Request timeout after ${timeoutMs}ms`), config)),
        timeoutMs + 1_000,
      );
    });

    const signal = config.signal
      ? mergeAbortSignals(config.signal, controller.signal)
      : controller.signal;

    try {
      const headers = prepareHeaders(config.headers ?? {}, config.data);
      const body = serializeBody(config.data, headers['Content-Type']) as
        | string
        | FormData
        | undefined;

      // Cast: types FormData/AbortSignal của RN khác lib chuẩn nhưng runtime tương thích
      const raw = await Promise.race([
        fetch(url, { method, headers, body, signal } as RequestInit),
        hardTimeout,
      ]);
      clearTimeout(timeoutId);

      if (!isSuccessStatus(raw.status)) {
        throw await HttpError.fromResponse(raw, config);
      }

      return await parseResponse<TResponse>(raw, config);
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw createHttpError(
          new Error(`Request timeout after ${timeoutMs}ms`),
          config,
        );
      }
      throw error;
    } finally {
      if (raceTimerId !== undefined) clearTimeout(raceTimerId);
    }
  }

  // ── Convenience Methods ───────────────────────────────────────────────────

  get<T>(url: string, config?: Omit<RequestConfig, 'url' | 'method'>) {
    return this.request<T>({ ...config, url, method: 'GET' });
  }

  post<T, D = unknown>(
    url: string,
    data?: D,
    config?: Omit<RequestConfig, 'url' | 'method' | 'data'>,
  ) {
    return this.request<T, D>({ ...config, url, method: 'POST', data });
  }

  put<T, D = unknown>(
    url: string,
    data?: D,
    config?: Omit<RequestConfig, 'url' | 'method' | 'data'>,
  ) {
    return this.request<T, D>({ ...config, url, method: 'PUT', data });
  }

  patch<T, D = unknown>(
    url: string,
    data?: D,
    config?: Omit<RequestConfig, 'url' | 'method' | 'data'>,
  ) {
    return this.request<T, D>({ ...config, url, method: 'PATCH', data });
  }

  delete<T>(url: string, config?: Omit<RequestConfig, 'url' | 'method'>) {
    return this.request<T>({ ...config, url, method: 'DELETE' });
  }

  // ── Private ───────────────────────────────────────────────────────────────

  private setupDefaultInterceptors(): void {
    createRequestInterceptors({ timing: true, requestId: true }).forEach(fn =>
      this.requestInterceptors.use(fn),
    );

    const { fulfilled, rejected } = createResponseInterceptors();
    fulfilled.forEach(fn => this.responseInterceptors.use(fn));
    rejected.forEach(fn => this.errorInterceptors.use(fn));
  }
}

// ── Singleton ─────────────────────────────────────────────────────────────────
export const httpClient = new HttpClient({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? '',
});
