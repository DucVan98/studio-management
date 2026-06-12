import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { NotificationItem } from '../../src/components/ui';

const meta = {
  title: 'UI/NotificationItem',
  component: NotificationItem,
  args: { message: 'Bạn có 1 kỷ niệm mới', time: '2 phút trước' },
} satisfies Meta<typeof NotificationItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Read: Story = {};
export const Unread: Story = { args: { icon: 'heart', isUnread: true } };

export const List: Story = {
  render: () => (
    <View className="gap-2">
      <NotificationItem icon="heart" message="Bạn có 1 kỷ niệm mới" time="2 phút trước" isUnread />
      <NotificationItem icon="bell" message="Nhắc nhở: Ngày kỷ niệm sắp tới" time="Hôm qua" />
      <NotificationItem icon="gift" message="Đối phương vừa gửi quà cho bạn" time="3 ngày trước" />
    </View>
  ),
};
