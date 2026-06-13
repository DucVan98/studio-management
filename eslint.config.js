// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,

  // ── Luật chung: siết convention + an toàn type ──────────────────────────────
  // (@typescript-eslint và import plugin đã được eslint-config-expo đăng ký)
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      // Cấm `any` — ép dùng `unknown` + type guard (xem CLAUDE.md). Có miễn trừ bên dưới.
      '@typescript-eslint/no-explicit-any': 'error',
      // Ép import type-only dùng `import type` — autofix, hook sẽ tự sửa.
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      // So sánh nghiêm ngặt.
      eqeqeq: ['error', 'smart'],
      // Cảnh báo (không chặn build) — nhắc giữ hàm nhỏ, ít tham số → SRP.
      'max-lines-per-function': [
        'warn',
        { max: 120, skipBlankLines: true, skipComments: true, IIFEs: true },
      ],
      'max-params': ['warn', 4],
      complexity: ['warn', 12],
    },
  },

  // ── Luật phụ thuộc Clean Architecture (TỰ ĐỘNG CHẶN) ────────────────────────
  // Chỉ cần 1 chỗ khai báo zones; áp cho toàn bộ src.
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            // domain là LÕI: không được import bất kỳ tầng ngoài nào
            { target: './src/domain', from: './src/data', message: 'domain không được phụ thuộc data' },
            { target: './src/domain', from: './src/http', message: 'domain không được phụ thuộc http' },
            { target: './src/domain', from: './src/services', message: 'domain không được phụ thuộc services' },
            { target: './src/domain', from: './src/queries', message: 'domain không được phụ thuộc queries' },
            { target: './src/domain', from: './src/stores', message: 'domain không được phụ thuộc stores' },
            { target: './src/domain', from: './src/screens', message: 'domain không được phụ thuộc screens' },
            { target: './src/domain', from: './src/components', message: 'domain không được phụ thuộc components' },
            { target: './src/domain', from: './src/navigation', message: 'domain không được phụ thuộc navigation' },
            { target: './src/domain', from: './src/di', message: 'domain không được phụ thuộc di' },
            // data không được phụ thuộc tầng presentation
            { target: './src/data', from: './src/queries', message: 'data không được phụ thuộc presentation' },
            { target: './src/data', from: './src/stores', message: 'data không được phụ thuộc presentation' },
            { target: './src/data', from: './src/screens', message: 'data không được phụ thuộc presentation' },
            { target: './src/data', from: './src/components', message: 'data không được phụ thuộc presentation' },
            { target: './src/data', from: './src/navigation', message: 'data không được phụ thuộc presentation' },
          ],
        },
      ],
    },
  },

  // ── domain phải THUẦN: cấm import thư viện hạ tầng ──────────────────────────
  {
    files: ['src/domain/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'react', message: 'domain phải thuần — không import react' },
            { name: 'react-native', message: 'domain phải thuần — không import react-native' },
            { name: '@legendapp/state', message: 'domain phải thuần — không import state lib' },
            { name: '@tanstack/react-query', message: 'domain phải thuần — không import query lib' },
            { name: 'nativewind', message: 'domain phải thuần — không import styling lib' },
            { name: 'react-native-mmkv', message: 'domain phải thuần — không import storage lib' },
          ],
          patterns: [
            {
              group: ['**/data/repositories/*', '**/Http*Repository'],
              message: 'usecase chỉ phụ thuộc interface I*Repository, không phụ thuộc impl Http*Repository',
            },
          ],
        },
      ],
    },
  },

  // ── Miễn trừ: shim hạ tầng buộc phải dùng any để khớp API Legend-State ──────
  {
    files: ['src/stores/persistence/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  {
    ignores: [
      'node_modules/*',
      '.expo/*',
      'dist/*',
      'android/*',
      'ios/*',
      // File do Storybook tự sinh mỗi lần chạy metro — không lint.
      '.rnstorybook/storybook.requires.ts',
    ],
  },
]);
