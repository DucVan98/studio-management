import type { Meta, StoryObj } from '@storybook/react-native';
import { View, Text } from 'react-native';

import { AnimatedCounter } from '../../src/components/ui';
import { Replay } from './replay';

const meta = {
  title: 'Animation/AnimatedCounter',
  component: AnimatedCounter,
  args: { value: 1024, className: 'text-display-lg font-bold text-accent' },
} satisfies Meta<typeof AnimatedCounter>;

export default meta;
type Story = StoryObj<typeof meta>;

// Đếm tăng dần khi mount.
export const Default: Story = {};

// Bấm "Phát lại" để xem đếm lại từ 0.
export const Replayable: Story = {
  render: () => (
    <Replay>
      <AnimatedCounter value={1024} className="text-display-lg font-bold text-accent" />
      <Text className="text-body-sm text-text-muted">ngày bên nhau</Text>
    </Replay>
  ),
};

export const Values: Story = {
  render: () => (
    <View className="gap-4 items-center">
      <AnimatedCounter value={12} className="text-display-md font-bold text-accent" />
      <AnimatedCounter value={365} className="text-display-md font-bold text-accent" />
      <AnimatedCounter value={1234567} className="text-display-md font-bold text-accent" />
    </View>
  ),
};
