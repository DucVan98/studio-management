import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Skeleton } from '../../src/components/ui';

const meta = {
  title: 'UI/Skeleton',
  component: Skeleton,
  args: { width: '100%', height: 80, radius: 20 },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {};
export const AvatarShape: Story = { args: { width: 48, height: 48, radius: 9999 } };

export const Presets: Story = {
  render: () => (
    <View className="gap-4">
      <Skeleton.Card />
      <Skeleton.ListRow />
      <Skeleton.StatCard />
    </View>
  ),
};
