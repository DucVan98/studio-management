import * as SecureStore from 'expo-secure-store';
import type { ITokenStorage } from '../domain/repositories/ITokenStorage';
import type { AuthTokens } from '../domain/entities';

const KEY = 'everly.auth_tokens';

/** Lưu token trong Keychain (iOS) / Keystore (Android) qua expo-secure-store. */
export class SecureTokenStorage implements ITokenStorage {
  async save(tokens: AuthTokens): Promise<void> {
    await SecureStore.setItemAsync(KEY, JSON.stringify(tokens));
  }

  async load(): Promise<AuthTokens | null> {
    const raw = await SecureStore.getItemAsync(KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as AuthTokens;
      if (!parsed.accessToken || !parsed.refreshToken) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  async clear(): Promise<void> {
    await SecureStore.deleteItemAsync(KEY);
  }
}
