import { vars } from 'nativewind';

/**
 * Design tokens từ Figma – collection "Theme"
 * 3 modes: Rose Romantic / Midnight Gold / Minimal Sky
 *
 * Dùng NativeWind vars() để inject CSS variables vào root View,
 * cho phép toàn bộ cây component dùng class như bg-bg, text-text, v.v.
 *
 * @example
 * // Trong _layout.tsx:
 * <View style={themeVars[theme]}>...</View>
 */

export type ThemeName = 'rose-romantic' | 'midnight-gold' | 'minimal-sky';

// ── Primitive values (Figma collection "Primitives") ──────────────────────────

export const primitives = {
  space: { 0: 0, 2: 2, 4: 4, 8: 8, 12: 12, 16: 16, 20: 20, 24: 24, 28: 28, 32: 32, 40: 40, 48: 48, 56: 56, 64: 64 },
  radius: { sm: 12, md: 20, lg: 28, pill: 9999 },
  stroke: { hairline: 1, regular: 2, thick: 3 },
  iconSize: { xs: 14, sm: 18, md: 20, lg: 24, xl: 26 },
} as const;

// ── Theme color values (hex) ───────────────────────────────────────────────────

export const themeColors: Record<ThemeName, Record<string, string>> = {
  'rose-romantic': {
    '--color-bg':          '#FFF5F7',
    '--color-surface':     '#FFFFFF',
    '--color-surface-alt': '#FCE7EE',
    '--color-accent':      '#D4537E',
    '--color-accent-2':    '#E08AA6',
    '--color-text':        '#791F1F',
    '--color-text-muted':  '#B07A86',
    '--color-on-accent':   '#FFFFFF',
    '--color-border':      '#F3D6DF',
  },
  'midnight-gold': {
    '--color-bg':          '#1A0E0A',
    '--color-surface':     '#2A1A12',
    '--color-surface-alt': '#3A2418',
    '--color-accent':      '#FAC775',
    '--color-accent-2':    '#EF9F27',
    '--color-text':        '#F4E9DC',
    '--color-text-muted':  '#C9B89E',
    '--color-on-accent':   '#1A0E0A',
    '--color-border':      '#4A3324',
  },
  'minimal-sky': {
    '--color-bg':          '#F0F4FF',
    '--color-surface':     '#FFFFFF',
    '--color-surface-alt': '#E4ECFB',
    '--color-accent':      '#378ADD',
    '--color-accent-2':    '#6FB0E8',
    '--color-text':        '#0C447C',
    '--color-text-muted':  '#5E78A8',
    '--color-on-accent':   '#FFFFFF',
    '--color-border':      '#D2DEF2',
  },
};

// ── NativeWind vars() – inject vào root View style ────────────────────────────

export const themeVars: Record<ThemeName, ReturnType<typeof vars>> = {
  'rose-romantic': vars(themeColors['rose-romantic']),
  'midnight-gold': vars(themeColors['midnight-gold']),
  'minimal-sky':   vars(themeColors['minimal-sky']),
};

export const defaultTheme: ThemeName = 'rose-romantic';
