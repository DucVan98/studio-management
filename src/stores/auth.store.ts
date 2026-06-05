import { observable } from '@legendapp/state';
import { configurePersistence } from './persistence/mmkv.adapter';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  [key: string]: unknown;
}

export interface AuthState {
  /** Authenticated user – null khi chưa đăng nhập */
  user: User | null;
  /** Access token */
  token: string | null;
  /** Trạng thái loading khi đang xử lý auth */
  isLoading: boolean;
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const authStore$ = observable<AuthState>({
  user: null,
  token: null,
  isLoading: false,
});

// Persist to MMKV
configurePersistence(authStore$, 'auth');

// ── Actions ───────────────────────────────────────────────────────────────────

export const authActions = {
  login(user: User, token: string): void {
    authStore$.user.set(user);
    authStore$.token.set(token);
  },

  logout(): void {
    authStore$.user.set(null);
    authStore$.token.set(null);
  },

  updateUser(updates: Partial<User>): void {
    const current = authStore$.user.peek();
    if (current) {
      authStore$.user.set({ ...current, ...updates });
    }
  },

  setLoading(loading: boolean): void {
    authStore$.isLoading.set(loading);
  },

  isAuthenticated(): boolean {
    return authStore$.user.peek() !== null && authStore$.token.peek() !== null;
  },

  getToken(): string | null {
    return authStore$.token.peek();
  },
};
