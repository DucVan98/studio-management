import './global.css';
import './src/i18n';

import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import { NavigationContainer } from '@react-navigation/native';
import type { LinkingOptions } from '@react-navigation/native';
import { useValue } from '@legendapp/state/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { appStore$, appActions } from '@/stores';
import { authStore$ } from '@/stores/auth.store';
import { themeVars } from '@/tokens';
import { queryClient } from '@/queries';
import { DIContainer } from '@/di/DIContainer.ts';
import { splashScreen } from '@/services/SplashScreenService.ts';
import { RootNavigator } from './src/navigation/RootNavigator';
import type { RootStackParamList } from '@/navigation/types.ts';

// Nitro auto-show splash khi launch và giữ tới khi gọi hide() (autoHide=false mặc định),
// nên không cần preventAutoHide thủ công ở đây.

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['everly://', 'https://everly.app'],
  config: {
    screens: {
      PartnerAccept: 'join/:code',
    },
  },
};

// RN 0.85 + New Architecture: SecureStore.getItemAsync() đôi khi không resolve
// trong bridgeless mode → bootstrap treo vô thời hạn → splash screen không ẩn.
const withBootTimeout = (promise: Promise<unknown>): Promise<unknown> =>
  Promise.race([promise, new Promise<void>(resolve => setTimeout(resolve, 5000))]);

export default function App() {
  const theme = useValue(appStore$.theme);
  const [booted, setBooted] = useState(false);
  const [sessionAuthenticated, setSessionAuthenticated] = useState(false);
  // Load font DM Sans theo design Figma; fontError → vẫn render với System font
  const [fontsLoaded, fontError] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  useEffect(() => {
    async function bootstrap() {
      try {
        // DEV ONLY: uncomment dòng dưới để clear session (thay cho uninstall trên iOS)
        // await DIContainer.getInstance().session.clear();
        const tokens = await withBootTimeout(DIContainer.getInstance().session.restore());
        setSessionAuthenticated(tokens !== null);
        appActions.initialize();
      } catch {
        // tiếp tục với unauthenticated state
      } finally {
        setBooted(true);
      }
    }
    bootstrap();
  }, []);

  // Session hết hạn (refresh fail) → xoá cache để không lộ data cũ
  useEffect(() => {
    return DIContainer.getInstance().onSessionExpired(() => {
      queryClient.clear();
    });
  }, []);

  // Khi booted + fonts sẵn sàng → ẩn Nitro splash (native) rồi render app
  const appReady = booted && (fontsLoaded || !!fontError);
  useEffect(() => {
    if (appReady) splashScreen.hide(300);
  }, [appReady]);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        {/* themeVars inject CSS variables cho toàn bộ cây component */}
        <View style={[{ flex: 1 }, themeVars[theme]]}>
          <StatusBar style={theme === 'midnight-gold' ? 'light' : 'dark'} />
          {appReady && (
            <NavigationContainer linking={linking}>
              {/* Routing khi boot:
                  - Không có session → Welcome (đăng nhập/đăng ký)
                  - Có session + chưa link couple → Invite (tiếp tục onboarding)
                  - Có session + đã có couple → App (main tabs) */}
              <RootNavigator initialRouteName={
                !sessionAuthenticated
                  ? 'Welcome'
                  : authStore$.user.peek()?.coupleId
                    ? 'App'
                    : 'Invite'
              } />
            </NavigationContainer>
          )}
        </View>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
