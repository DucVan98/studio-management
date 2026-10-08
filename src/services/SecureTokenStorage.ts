import * as SecureStore from 'expo-secure-store';

const KEY = 'studiomanagement.auth_tokens';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/** Lưu token trong Keychain (iOS) / Keystore (Android) qua expo-secure-store. */
export class SecureTokenStorage {
  async save(tokens: AuthTokens): Promise<void> {
    await SecureStore.setItemAsync(KEY, JSON.stringify(tokens));
  }

  async load(): Promise<AuthTokens | null> {
    try {
      const raw = await SecureStore.getItemAsync(KEY);
      if (!raw) return null;
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
