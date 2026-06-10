import type { AuthTokens } from '../domain/entities';
import type { ITokenStorage } from '../domain/repositories/ITokenStorage';
import type { ISessionManager } from '../domain/repositories/ISessionManager';
import type { TokenProvider } from '../http/AuthHttpClient';

/** Refresh trước khi token thực sự hết hạn (đệm clock skew). */
const EXPIRY_BUFFER_MS = 30_000;

export type RefreshExecutor = (refreshToken: string) => Promise<AuthTokens>;

/**
 * Quản lý vòng đời token:
 * - Giữ token trong memory, persist qua ITokenStorage (SecureStore)
 * - Refresh token rotation: chỉ giữ token mới nhất
 * - Single-flight: nhiều request 401 cùng lúc chỉ trigger 1 lần refresh
 * - Refresh fail → clear session + báo listener (logout về màn login)
 *
 * RefreshExecutor được inject từ DI (gọi IAuthRepository.refresh) để tránh
 * circular dependency giữa HttpClient ↔ AuthRepository.
 */
export class AuthSessionService implements TokenProvider, ISessionManager {
  private tokens: AuthTokens | null = null;
  private refreshing: Promise<string | null> | null = null;
  private refreshExecutor: RefreshExecutor | null = null;
  private readonly expiredListeners = new Set<() => void>();

  constructor(private readonly storage: ITokenStorage) {}

  // ── Wiring ──────────────────────────────────────────────────────────────────

  setRefreshExecutor(executor: RefreshExecutor): void {
    this.refreshExecutor = executor;
  }

  /** Đăng ký callback khi session hết hạn (refresh fail) — return unsubscribe. */
  onSessionExpiredListener(listener: () => void): () => void {
    this.expiredListeners.add(listener);
    return () => this.expiredListeners.delete(listener);
  }

  // ── Lifecycle ───────────────────────────────────────────────────────────────

  /** Gọi khi app khởi động — khôi phục token từ SecureStore. */
  async restore(): Promise<AuthTokens | null> {
    this.tokens = await this.storage.load();
    return this.tokens;
  }

  /** Gọi sau login / verify-email / refresh thành công. */
  async start(tokens: AuthTokens): Promise<void> {
    this.tokens = tokens;
    await this.storage.save(tokens);
  }

  async clear(): Promise<void> {
    this.tokens = null;
    await this.storage.clear();
  }

  get isAuthenticated(): boolean {
    return this.tokens !== null;
  }

  get refreshToken(): string | null {
    return this.tokens?.refreshToken ?? null;
  }

  // ── TokenProvider (dùng bởi AuthHttpClient) ─────────────────────────────────

  async getAccessToken(): Promise<string | null> {
    if (!this.tokens) return null;
    if (this.isExpiringSoon(this.tokens.expiresAt)) {
      return this.refreshAccessToken();
    }
    return this.tokens.accessToken;
  }

  /** Single-flight refresh — trả access token mới hoặc null nếu fail. */
  refreshAccessToken(): Promise<string | null> {
    if (this.refreshing) return this.refreshing;

    this.refreshing = this.doRefresh().finally(() => {
      this.refreshing = null;
    });
    return this.refreshing;
  }

  async onSessionExpired(): Promise<void> {
    await this.clear();
    this.expiredListeners.forEach(listener => listener());
  }

  // ── Private ─────────────────────────────────────────────────────────────────

  private async doRefresh(): Promise<string | null> {
    const refreshToken = this.tokens?.refreshToken;
    if (!refreshToken || !this.refreshExecutor) return null;

    try {
      const tokens = await this.refreshExecutor(refreshToken);
      await this.start(tokens);
      return tokens.accessToken;
    } catch {
      // Refresh token bị revoke / hết hạn → session chết
      await this.onSessionExpired();
      return null;
    }
  }

  private isExpiringSoon(expiresAt: string): boolean {
    const expiry = Date.parse(expiresAt);
    if (Number.isNaN(expiry)) return false;
    return Date.now() >= expiry - EXPIRY_BUFFER_MS;
  }
}
