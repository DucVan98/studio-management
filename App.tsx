import './global.css';
import './src/i18n';

import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import type { LinkingOptions } from '@react-navigation/native';
import { useValue } from '@legendapp/state/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { appStore$, appActions } from '@/stores';
import { themeVars } from '@/tokens';
import { queryClient } from '@/queries';
import { DIContainer } from '@/di/DIContainer.ts';
import { RootNavigator } from './src/navigation/RootNavigator';
import type { RootStackParamList } from '@/navigation/types.ts';

SplashScreen.preventAutoHideAsync();

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
  // Dùng SecureStore (session) thay vì authStore$.user (MMKV) để định tuyến —
  // session.restore() là nguồn đúng cho trạng thái auth khi khởi động.
  const [sessionAuthenticated, setSessionAuthenticated] = useState(false);

  useEffect(() => {
    async function bootstrap() {
      try {
        const tokens = await withBootTimeout(DIContainer.getInstance().session.restore());
        setSessionAuthenticated(tokens !== null);
        appActions.initialize();
      } catch {
        // tiếp tục với unauthenticated state
      } finally {
        setBooted(true);
        await SplashScreen.hideAsync();
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

  if (!booted) return null;

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        {/* themeVars inject CSS variables cho toàn bộ cây component */}
        <View style={[{ flex: 1 }, themeVars[theme]]}>
          <StatusBar style={theme === 'midnight-gold' ? 'light' : 'dark'} />
          <NavigationContainer linking={linking}>
            <RootNavigator initialRouteName={sessionAuthenticated ? 'App' : 'Welcome'} />
          </NavigationContainer>
        </View>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}