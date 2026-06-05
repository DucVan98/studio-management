import { HttpClient, httpClient } from '../http';
import { HttpAuthDataSource } from '../data/datasources/HttpAuthDataSource';
import { HttpAuthRepository } from '../data/repositories/HttpAuthRepository';
import { LoginUseCase } from '../domain/usecases/LoginUseCase';
import type { IAuthRepository } from '../domain/repositories/IAuthRepository';

/**
 * DIContainer – Dependency Injection (Singleton Pattern).
 *
 * Wire toàn bộ dependencies theo Clean Architecture:
 *   UseCase → Repository Interface → Repository Impl → DataSource → HttpClient
 *
 * @example
 * const container = DIContainer.getInstance();
 * const loginUseCase = container.getLoginUseCase();
 * await loginUseCase.execute({ email, password });
 *
 * // Extend cho feature-specific containers:
 * class ProfileDIContainer extends DIContainer {
 *   getProfileUseCase() { ... }
 * }
 */
export class DIContainer {
  private static instance: DIContainer | null = null;

  protected readonly http: HttpClient;

  // Lazy-initialized
  private _authRepository?: IAuthRepository;
  private _loginUseCase?: LoginUseCase;

  protected constructor() {
    this.http = httpClient;
  }

  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  static resetInstance(): void {
    DIContainer.instance = null;
  }

  // ── Repositories ──────────────────────────────────────────────────────────

  getAuthRepository(): IAuthRepository {
    if (!this._authRepository) {
      const dataSource = new HttpAuthDataSource(this.http);
      this._authRepository = new HttpAuthRepository(dataSource);
    }
    return this._authRepository;
  }

  // ── Use Cases ─────────────────────────────────────────────────────────────

  getLoginUseCase(): LoginUseCase {
    if (!this._loginUseCase) {
      this._loginUseCase = new LoginUseCase(this.getAuthRepository());
    }
    return this._loginUseCase;
  }

  // ── Utilities ─────────────────────────────────────────────────────────────

  protected reset(): void {
    this._authRepository = undefined;
    this._loginUseCase = undefined;
  }
}
