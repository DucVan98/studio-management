import type { Meta, StoryObj } from '@storybook/react-native';
import { View, Text } from 'react-native';

import { ProgressRing } from '../../src/components/ui';
import { Replay } from './replay';

const meta = {
  title: 'Animation/ProgressRing',
  component: ProgressRing,
  args: { value: 0.92 },
} satisfies Meta<typeof ProgressRing>;

export default meta;
type Story = StoryObj<typeof meta>;

// Vòng vẽ dần khi mount.
export const Default: Story = {
  render: () => (
    <ProgressRing value={0.92}>
      <Text className="text-display-md font-bold text-accent">92</Text>
    </ProgressRing>
  ),
};

export const Replayable: Story = {
  render: () => (
    <Replay>
      <ProgressRing value={0.92}>
        <Text className="text-display-md font-bold text-accent">92</Text>
      </ProgressRing>
    </Replay>
  ),
};

export const Levels: Story = {
  render: () => (
    <View className="flex-row gap-4 flex-wrap justify-center">
      {[0.25, 0.6, 1].map(v => (
        <ProgressRing key={v} value={v} size={96} strokeWidth={9}>
          <Text className="text-heading-lg font-bold text-accent">{Math.round(v * 100)}</Text>
        </ProgressRing>
      ))}
    </View>
  ),
};
