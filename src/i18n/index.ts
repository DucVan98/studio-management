import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import vi from './locales/vi';
import en from './locales/en';

export const resources = {
  vi: { translation: vi },
  en: { translation: en },
} as const;

export type TranslationKeys = typeof vi;
export type SupportedLanguage = keyof typeof resources;

let deviceLanguage = 'vi';
try {
  deviceLanguage = Intl.DateTimeFormat().resolvedOptions().locale.split('-')[0] || 'vi';
} catch { /* Intl không khả dụng */ }
const lng: SupportedLanguage = deviceLanguage === 'en' ? 'en' : 'vi';

// eslint-disable-next-line import/no-named-as-default-member -- i18next fluent API
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng,
    fallbackLng: 'vi',
    interpolation: {
      escapeValue: false, // React already escapes
    },
    compatibilityJSON: 'v4',
  });

export { i18n };
export default i18n;
