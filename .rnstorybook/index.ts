// Entry của Storybook — chỉ được require khi EXPO_PUBLIC_STORYBOOK_ENABLED=true (xem index.js gốc).
// Import global.css để NativeWind inject styles giống App.tsx.
import '../global.css';

import { createElement } from 'react';
import { registerRootComponent } from 'expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';

import { view } from './storybook.requires';

const StorybookUIRoot = view.getStorybookUI({
  shouldPersistSelection: true,
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
});

// Load DM Sans giống App.tsx — không có wrapper này thì story render bằng System font.
// (File .ts nên dùng createElement thay vì JSX.)
function StorybookRoot() {
  const [fontsLoaded, fontError] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });
  if (!fontsLoaded && !fontError) return null;
  return createElement(StorybookUIRoot);
}

registerRootComponent(StorybookRoot);
