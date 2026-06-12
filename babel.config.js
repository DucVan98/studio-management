module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    // react-native-reanimated v4 (dependency của Storybook UI) yêu cầu worklets plugin — phải đứng CUỐI.
    plugins: ['react-native-worklets/plugin'],
  };
};
