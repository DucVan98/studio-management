import { computed, observable } from '@legendapp/state';
import { configurePersistence } from './persistence/mmkv.adapter';
import type { ThemeName } from '../tokens';
import { defaultTheme } from '../tokens';

// ── Types ─────────────────────────────────────────────────────────────────────

/** Figma "Theme" collection modes */
export type { ThemeName };
export type Language = 'vi' | 'en';

export interface AppState {
  /** Đã khởi tạo xong chưa */
  initialized: boolean;
  /** Theme hiện tại – map 1:1 với Figma modes */
  theme: ThemeName;
  /** Ngôn ngữ */
  language: Language;
  /** Phiên bản API */
  apiVersion: string;
  /** Feature flags */
  features: Record<string, boolean>;
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const appStore$ = observable<AppState>({
  initialized: false,
  theme: defaultTheme,
  language: 'vi',
  apiVersion: 'v1',
  features: {},
});

configurePersistence(appStore$, 'app');

// ── Computed ──────────────────────────────────────────────────────────────────

export const appComputed = {
  isReady: computed(() => appStore$.initialized.get()),

  isDarkMode: computed(() => appStore$.theme.get() === 'midnight-gold'),

  isFeatureEnabled: (flag: string) =>
    computed(() => appStore$.features.get()[flag] ?? false),
};

// ── Actions ───────────────────────────────────────────────────────────────────

export const appActions = {
  initialize(): void {
    appStore$.initialized.set(true);
  },

  setTheme(theme: ThemeName): void {
    appStore$.theme.set(theme);
  },

  setLanguage(lang: Language): void {
    appStore$.language.set(lang);
  },

  setFeatureFlags(flags: Record<string, boolean>): void {
    appStore$.features.set(flags);
  },

  reset(): void {
    appStore$.set({
      initialized: false,
      theme: defaultTheme,
      language: 'vi',
      apiVersion: 'v1',
      features: {},
    });
  },
};
