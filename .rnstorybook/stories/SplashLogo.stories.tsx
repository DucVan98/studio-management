import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { SplashLogo } from '../../src/components/ui';
import { Replay } from './replay';

const meta = {
  title: 'Animation/SplashLogo',
  component: SplashLogo,
} satisfies Meta<typeof SplashLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

// Tim bung ra + wordmark fade lên. Bấm "Phát lại" để xem lại.
export const Default: Story = {
  render: () => (
    <Replay>
      <View className="items-center justify-center" style={{ height: 200 }}>
        <SplashLogo />
      </View>
    </Replay>
  ),
};

export const Large: Story = {
  render: () => (
    <Replay>
      <View className="items-center justify-center" style={{ height: 240 }}>
        <SplashLogo size={120} />
      </View>
    </Replay>
  ),
};
