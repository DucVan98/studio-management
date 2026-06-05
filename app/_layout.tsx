import '../global.css';
import '../src/i18n';

import { useEffect } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useValue } from '@legendapp/state/react';
import { appStore$, appActions } from '../src/stores/app.store';
import { themeVars } from '../src/tokens';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const initialized = useValue(appStore$.initialized);
  const theme = useValue(appStore$.theme);

  useEffect(() => {
    async function bootstrap() {
      try {
        await new Promise(resolve => setTimeout(resolve, 100));
        appActions.initialize();
      } finally {
        SplashScreen.hideAsync();
      }
    }
    bootstrap();
  }, []);

  return (
    // themeVars inject CSS variables cho toàn bộ cây component
    <View style={[{ flex: 1 }, themeVars[theme]]}>
      <StatusBar style={theme === 'midnight-gold' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(app)" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </View>
  );
}
