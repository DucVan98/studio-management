import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    // Stories Storybook (chỉ được bundle khi STORYBOOK_ENABLED=true)
    './.rnstorybook/**/*.{js,jsx,ts,tsx}',
  ],
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- nativewind/preset không có ESM types
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // ── Figma "Theme" collection – semantic tokens ──────────────
        // Giá trị inject qua NativeWind vars() (native) / CSS vars (web)
        // Đổi theme bằng cách set themeVars[theme] trên root View
        bg:            'var(--color-bg)',
        surface:       'var(--color-surface)',
        'surface-alt': 'var(--color-surface-alt)',
        accent:        'var(--color-accent)',
        'accent-2':    'var(--color-accent-2)',
        text:          'var(--color-text)',
        'text-muted':  'var(--color-text-muted)',
        'on-accent':   'var(--color-on-accent)',
        border:        'var(--color-border)',
        // ── Semantic trạng thái (không đổi theo theme) ──────────────
        success: '#22c55e',
        warning: '#f59e0b',
        error:   '#ef4444',
        info:    '#3b82f6',
      },
      fontFamily: {
        // Map Figma font styles → font families
        sans:   ['DMSans_400Regular', 'System'],
        medium: ['DMSans_500Medium', 'System'],
        bold:   ['DMSans_700Bold', 'System'],
        // Heading serif (Figma dùng serif display). Dùng font hệ thống:
        // iOS có 'Georgia'; Android fallback generic 'serif'.
        serif:  ['Georgia', 'serif'],
      },
      fontSize: {
        // Figma text styles
        'display-lg': ['48px', { lineHeight: '56px', letterSpacing: '-0.5px' }],
        'display-md': ['36px', { lineHeight: '44px', letterSpacing: '-0.3px' }],
        'heading-xl': ['24px', { lineHeight: '32px', letterSpacing: '-0.2px' }],
        'heading-lg': ['20px', { lineHeight: '28px' }],
        'heading-md': ['18px', { lineHeight: '24px' }],
        'body-lg':    ['16px', { lineHeight: '24px' }],
        'body-md':    ['14px', { lineHeight: '20px' }],
        // Riêng cho TextInput: KHÔNG có lineHeight — Fabric bug khiến
        // TextInput + lineHeight wrap như multiline và lệch căn giữa dọc.
        'body-input': '14px',
        'body-sm':    ['12px', { lineHeight: '16px' }],
        'button':     ['15px', { lineHeight: '20px' }], // Figma: text button 15px Medium
        'label':      ['11px', { lineHeight: '14px', letterSpacing: '0.5px' }],
      },
      borderRadius: {
        // Figma "Primitives" – radius tokens
        none: '0px',
        sm:   '12px',   // radius/sm
        md:   '20px',   // radius/md
        lg:   '28px',   // radius/lg
        pill: '9999px', // radius/pill
        // Kept for backward compat
        xl:   '16px',
        '2xl':'20px',
        '3xl':'24px',
        full: '9999px',
      },
      spacing: {
        // 4px grid – matches Figma default 8-point grid
        '0.5':  '2px',
        '1':    '4px',
        '1.5':  '6px',
        '2':    '8px',
        '2.5':  '10px',
        '3':    '12px',
        '3.5':  '14px',
        '4':    '16px',
        '5':    '20px',
        '6':    '24px',
        '7':    '28px',
        '8':    '32px',
        '9':    '36px',
        '10':   '40px',
        '11':   '44px',
        '12':   '48px',
        '14':   '56px',
        '16':   '64px',
        '20':   '80px',
        '24':   '96px',
      },
      borderWidth: {
        // Figma "Primitives" – stroke tokens
        hairline: '1px',  // stroke/hairline
        regular:  '2px',  // stroke/regular
        thick:    '3px',  // stroke/thick
      },
      size: {
        // Figma "Primitives" – icon size tokens
        'icon-xs': '14px',
        'icon-sm': '18px',
        'icon-md': '20px',
        'icon-lg': '24px',
        'icon-xl': '26px',
      },
      boxShadow: {
        // Figma elevation levels
        'sm':  '0 1px 2px rgba(0,0,0,0.05)',
        'md':  '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
        'lg':  '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
        'xl':  '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
};

export default config;
