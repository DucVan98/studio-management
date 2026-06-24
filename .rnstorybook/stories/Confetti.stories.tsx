import type { Meta, StoryObj } from '@storybook/react-native';
import { View, Text } from 'react-native';

import { Confetti, CountdownCard } from '../../src/components/ui';
import { Replay } from './replay';

const meta = {
  title: 'Animation/Confetti',
  component: Confetti,
} satisfies Meta<typeof Confetti>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mưa confetti ăn mừng — bấm "Phát lại" để xem lại.
export const Celebration: Story = {
  render: () => (
    <Replay>
      <View className="relative items-center justify-center bg-surface rounded-2xl overflow-hidden" style={{ width: 300, height: 220 }}>
        <Confetti count={28} fallDistance={220} />
        <Text className="text-display-md font-bold text-accent">🎉</Text>
        <Text className="text-body-md font-semibold text-text mt-2">Đã kết nối!</Text>
      </View>
    </Replay>
  ),
};

// Kết hợp với count-up cho màn "Đã kết nối".
export const OnConnected: Story = {
  render: () => (
    <Replay>
      <View className="relative overflow-hidden rounded-2xl" style={{ width: 320 }}>
        <Confetti count={24} fallDistance={260} />
        <CountdownCard variant="together" startDate={new Date('2022-02-14')} />
      </View>
    </Replay>
  ),
};
