import { AuthHttpClient } from '../http';
import { SecureTokenStorage } from '../services/SecureTokenStorage';

/**
 * Singleton container cho dependency injection.
 * Mỗi usecase/service được đăng ký 1 lần duy nhất.
 */
class DIContainerInstance {
  private static instance: DIContainerInstance;
  private httpClient: AuthHttpClient;
  private tokenStorage: SecureTokenStorage;

  private constructor() {
    this.httpClient = new AuthHttpClient();
    this.tokenStorage = new SecureTokenStorage();
  }

  static getInstance(): DIContainerInstance {
    if (!DIContainerInstance.instance) {
      DIContainerInstance.instance = new DIContainerInstance();
    }
    return DIContainerInstance.instance;
  }

  getHttpClient(): AuthHttpClient {
    return this.httpClient;
  }

  getTokenStorage(): SecureTokenStorage {
    return this.tokenStorage;
  }

  // ── Thêm usecase/repository dưới đây khi mở rộng ──
}

export const DIContainer = DIContainerInstance;
