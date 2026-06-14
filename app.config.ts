import type { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const bundleId = process.env.BUNDLE_ID ?? 'com.yourcompany.everly';

  // Deep link / universal link — đồng bộ với src/config/links.ts (cùng đọc từ env)
  const scheme = process.env.EXPO_PUBLIC_DEEPLINK_SCHEME ?? 'everly';
  const universalHost = process.env.EXPO_PUBLIC_UNIVERSAL_LINK_HOST ?? 'https://everly.app';
  // Lấy domain trần (bỏ scheme http) cho associatedDomains / intentFilters
  const universalDomain = universalHost.replace(/^https?:\/\//, '');
  const invitePath = process.env.EXPO_PUBLIC_INVITE_PATH ?? 'join';
  // Universal link cần Apple Developer Program trả phí (capability Associated Domains).
  // Personal team (free) build máy thật sẽ fail → mặc định TẮT, bật bằng env khi có account.
  const universalLinksEnabled = process.env.EXPO_PUBLIC_ENABLE_UNIVERSAL_LINKS === 'true';

  return {
    ...config,
    name: 'Everly',
    slug: 'everly',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    // Splash được cấu hình qua plugin expo-splash-screen ở dưới (top-level `splash`
    // đã bị bỏ khỏi ExpoConfig từ SDK 54+).
    ios: {
      supportsTablet: true,
      bundleIdentifier: bundleId,
      ...(universalLinksEnabled
        ? { associatedDomains: [`applinks:${universalDomain}`] }
        : {}),
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: bundleId,
      ...(universalLinksEnabled
        ? {
            intentFilters: [
              {
                action: 'VIEW',
                autoVerify: true,
                data: [{ scheme: 'https', host: universalDomain, pathPrefix: `/${invitePath}` }],
                category: ['BROWSABLE', 'DEFAULT'],
              },
            ],
          }
        : {}),
    },
    web: {
      bundler: 'metro',
      output: 'single',
      favicon: './assets/favicon.png',
    },
    plugins: [
      'expo-font',
      [
        'expo-splash-screen',
        {
          image: './assets/splash-icon.png',
          imageWidth: 160,
          resizeMode: 'contain',
          backgroundColor: '#FFF5F7',
        },
      ],
      'expo-localization',
      'expo-secure-store',
      [
        'expo-image-picker',
        {
          photosPermission:
            'Cho phép Everly truy cập thư viện ảnh để chọn ảnh đại diện và ảnh kỷ niệm.',
          cameraPermission:
            'Cho phép Everly dùng camera để chụp ảnh đại diện và ảnh kỷ niệm.',
        },
      ],
      [
        '@ducanh261101a/react-native-nitro-splash',
        {
          autoShow: true,
          autoHide: false,
        },
      ],
    ],
    scheme,
  };
};
