const {
  withStorybook,
} = require('@storybook/react-native/withStorybook');

const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Storybook chỉ bật khi STORYBOOK_ENABLED=true (script `pnpm storybook:*`).
// Khi tắt, withStorybook loại bỏ toàn bộ module storybook khỏi bundle app chính.
module.exports = withStorybook(withNativeWind(config, { input: './global.css' }), {
  enabled: process.env.STORYBOOK_ENABLED === 'true',
  configPath: `${__dirname}/.rnstorybook`,
});
