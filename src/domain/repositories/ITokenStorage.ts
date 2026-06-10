import type { AuthTokens } from '../entities';

/**
 * Lưu trữ token an toàn (Keychain/Keystore).
 * Interface ở domain — implementation (SecureStore) ở tầng ngoài.
 */
export interface ITokenStorage {
  save(tokens: AuthTokens): Promise<void>;
  load(): Promise<AuthTokens | null>;
  clear(): Promise<void>;
}
