import type { Preview } from '@storybook/react-native';
import { ScrollView, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { themeVars } from '../src/tokens';

const preview: Preview = {
  decorators: [
    // Bọc mọi story trong theme vars (giống root View của App.tsx) + SafeAreaProvider
    // để các component dùng token (bg-accent, text-text...) và useSafeAreaInsets hoạt động.
    Story => (
      <SafeAreaProvider>
        <View className="flex-1" style={themeVars['rose-romantic']}>
          <ScrollView className="flex-1 bg-bg" contentContainerClassName="p-4 gap-4">
            <Story />
          </ScrollView>
        </View>
      </SafeAreaProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
