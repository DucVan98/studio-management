import type { Meta, StoryObj } from '@storybook/react-native';
import { View, Text } from 'react-native';

import { HeartPullToRefresh } from '../../src/components/ui';

const meta = {
  title: 'Animation/HeartPullToRefresh',
  component: HeartPullToRefresh,
  decorators: [
    Story => (
      <View className="rounded-2xl overflow-hidden bg-surface" style={{ height: 360, width: 320 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof HeartPullToRefresh>;

export default meta;
type Story = StoryObj<typeof meta>;

const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

// Kéo xuống → tim lớn dần; thả tay → HeartbeatLoader ~1.5s. (Rõ nhất trên iOS.)
export const Default: Story = {
  render: () => (
    <HeartPullToRefresh onRefresh={() => wait(1500)}>
      <View className="p-4 gap-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <View key={i} className="bg-surface-alt rounded-xl px-4 py-5">
            <Text className="text-body-md text-text">Kỷ niệm #{i + 1}</Text>
          </View>
        ))}
      </View>
    </HeartPullToRefresh>
  ),
};
