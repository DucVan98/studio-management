import { HttpClient } from './HttpClient';
import { HttpError } from './errors';
import type {
  HttpClientConfig,
  HttpResponse,
  RequestConfig,
  RequestMetadata,
} from './types';

/** Routes public — không gắn Authorization, 401 ở đây không trigger refresh. */
const PUBLIC_PATHS = [
  '/auth/register',
  '/auth/verify-email',
  '/auth/login',
  '/auth/refresh',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/oauth',
  '/health',
];

export interface TokenProvider {
  getAccessToken(): Promise<string | null>;
  /** Single-flight refresh; trả access token mới hoặc null nếu fail. */
  refreshAccessToken(): Promise<string | null>;
  onSessionExpired(): void | Promise<void>;
}

function isPublicPath(url: string): boolean {
  return PUBLIC_PATHS.some(path => url === path || url.startsWith(`${path}/`));
}

/**
 * HttpClient + auth (Open/Closed: extend, không sửa HttpClient):
 * - Tự gắn `Authorization: Bearer <token>` cho route private
 * - 401 → refresh token (single-flight) → retry request đúng 1 lần
 * - Refresh fail → onSessionExpired (logout)
 */
export class AuthHttpClient extends HttpClient {
  constructor(
    config: HttpClientConfig,
    private readonly tokenProvider: TokenProvider,
  ) {
    super(config);
  }

  override async request<TResponse, TData = unknown>(
    config: RequestConfig<TData>,
  ): Promise<HttpResponse<TResponse>> {
    const isPublic = isPublicPath(config.url);
    const authed = isPublic ? config : await this.withAuthHeader(config);

    try {
      return await super.request<TResponse, TData>(authed);
    } catch (error) {
      if (!this.shouldRetryWithRefresh(error, isPublic, config)) throw error;

      const newToken = await this.tokenProvider.refreshAccessToken();
      if (!newToken) {
        await this.tokenProvider.onSessionExpired();
        throw error;
      }

      return super.request<TResponse, TData>({
        ...config,
        headers: { ...config.headers, Authorization: `Bearer ${newToken}` },
        metadata: { ...config.metadata, retryCount: (config.metadata?.retryCount ?? 0) + 1 },
      });
    }
  }

  private async withAuthHeader<TData>(
    config: RequestConfig<TData>,
  ): Promise<RequestConfig<TData>> {
    const token = await this.tokenProvider.getAccessToken();
    if (!token) return config;
    return {
      ...config,
      headers: { ...config.headers, Authorization: `Bearer ${token}` },
    };
  }

  private shouldRetryWithRefresh(
    error: unknown,
    isPublic: boolean,
    config: { metadata?: RequestMetadata },
  ): boolean {
    return (
      !isPublic &&
      HttpError.isHttpError(error) &&
      error.status === 401 &&
      (config.metadata?.retryCount ?? 0) === 0
    );
  }
}
