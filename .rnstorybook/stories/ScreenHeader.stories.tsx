import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { ScreenHeader } from '../../src/components/ui';

const meta = {
  title: 'UI/ScreenHeader',
  component: ScreenHeader,
  // Tắt safeArea trong story vì header nằm giữa canvas, không sát mép màn hình.
  args: { title: 'Kỷ niệm', safeArea: false },
} satisfies Meta<typeof ScreenHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithBackAndAction: Story = {
  args: { onBack: () => {}, rightIcon: 'settings', onRightPress: () => {} },
};

export const Transparent: Story = {
  render: () => (
    <View className="bg-accent rounded-2xl overflow-hidden">
      <ScreenHeader title="Trên ảnh" transparent safeArea={false} onBack={() => {}} rightIcon="edit-2" />
    </View>
  ),
};
