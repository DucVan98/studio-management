import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { MilestoneRow } from '../../src/components/ui';

const meta = {
  title: 'UI/MilestoneRow',
  component: MilestoneRow,
  args: { title: 'Ngày gặp nhau', date: '14/02/2022', days: '+856 ngày' },
} satisfies Meta<typeof MilestoneRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Today: Story = {
  args: { icon: 'star', title: 'Kỷ niệm 1 năm', date: '14/02/2023', days: 'Hôm nay', isToday: true },
};

export const List: Story = {
  render: () => (
    <View className="gap-3">
      <MilestoneRow icon="heart" title="Ngày gặp nhau" date="14/02/2022" days="+856 ngày" />
      <MilestoneRow icon="star" title="Kỷ niệm 1 năm" date="14/02/2023" days="Hôm nay" isToday />
      <MilestoneRow icon="gift" title="Sinh nhật em" date="20/08/2024" days="-32 ngày" />
    </View>
  ),
};
