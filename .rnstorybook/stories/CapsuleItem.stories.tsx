import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { CapsuleItem } from '../../src/components/ui';

const meta = {
  title: 'UI/CapsuleItem',
  component: CapsuleItem,
  args: { title: 'Capsule tháng 6', status: 'Sealed', daysLeft: '45 ngày', progress: 0.3 },
} satisfies Meta<typeof CapsuleItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sealed: Story = {};
export const Unlocked: Story = {
  args: { title: 'Capsule Tết', status: 'Đã mở', daysLeft: 'Mở', isUnlocked: true },
};

export const List: Story = {
  render: () => (
    <View className="gap-3">
      <CapsuleItem icon="lock" title="Capsule tháng 6" status="Sealed" daysLeft="45 ngày" progress={0.3} />
      <CapsuleItem icon="lock" title="Capsule 1 năm" status="Sealed" daysLeft="120 ngày" progress={0.7} />
      <CapsuleItem icon="star" title="Capsule Tết" status="Đã mở" isUnlocked />
    </View>
  ),
};
