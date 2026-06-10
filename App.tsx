import './global.css';
import './src/i18n';

import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import type { LinkingOptions } from '@react-navigation/native';
import { useValue } from '@legendapp/state/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { appStore$, appActions } from './src/stores/app.store';
import { authStore$ } from './src/stores/auth.store';
import { themeVars } from './src/tokens';
import { queryClient } from './src/queries';
import { DIContainer } from './src/di/DIContainer';
import { RootNavigator } from './src/navigation/RootNavigator';
import type { RootStackParamList } from './src/navigation/types';

SplashScreen.preventAutoHideAsync();

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['everly://', 'https://everly.app'],
  config: {
    screens: {
      PartnerAccept: 'join/:code',
    },
  },
};

export default function App() {
  const theme = useValue(appStore$.theme);
  const user = useValue(authStore$.user);
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    async function bootstrap() {
      try {
        // Khôi phục token từ SecureStore trước khi render navigator
        await DIContainer.getInstance().session.restore();
        appActions.initialize();
      } finally {
        setBooted(true);
        SplashScreen.hideAsync();
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

  if (!booted) return null; // splash vẫn hiển thị

  return (
    <QueryClientProvider client={queryClient}>
      {/* themeVars inject CSS variables cho toàn bộ cây component */}
      <View style={[{ flex: 1 }, themeVars[theme]]}>
        <StatusBar style={theme === 'midnight-gold' ? 'light' : 'dark'} />
        <NavigationContainer linking={linking}>
          <RootNavigator initialRouteName={user ? 'App' : 'Welcome'} />
        </NavigationContainer>
      </View>
    </QueryClientProvider>
  );
}
