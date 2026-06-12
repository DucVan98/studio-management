// Entry point sau khi gỡ expo-router (thay cho "expo-router/entry").
// Khi chạy `pnpm storybook:*`, EXPO_PUBLIC_STORYBOOK_ENABLED=true → load Storybook
// (.rnstorybook/index.ts tự registerRootComponent). Mặc định load app như cũ.
if (process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true') {
  require('./.rnstorybook');
} else {
  const { registerRootComponent } = require('expo');
  const App = require('./App').default;
  registerRootComponent(App);
}
