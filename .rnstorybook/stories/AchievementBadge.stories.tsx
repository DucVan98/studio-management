import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { AchievementBadge } from '../../src/components/ui';
import { Replay } from './replay';

const meta = {
  title: 'Animation/AchievementBadge',
  component: AchievementBadge,
  args: { icon: 'award', label: '1000 ngày bên nhau' },
} satisfies Meta<typeof AchievementBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

// Huy hiệu bật ra + vệt sáng khi mount (kèm rung haptic success trên thiết bị thật).
export const Default: Story = {};

export const Replayable: Story = {
  render: () => (
    <Replay label="Mở khoá lại">
      <AchievementBadge icon="award" label="1000 ngày bên nhau" />
    </Replay>
  ),
};

export const Variants: Story = {
  render: () => (
    <View className="flex-row gap-6 flex-wrap justify-center">
      <AchievementBadge icon="heart" label="Đôi tim vàng" size={80} />
      <AchievementBadge icon="star" label="Cột mốc 5 năm" size={80} />
      <AchievementBadge icon="zap" label="Streak 30 ngày" size={80} />
    </View>
  ),
};
