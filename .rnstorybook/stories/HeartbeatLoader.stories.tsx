import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { HeartbeatLoader } from '../../src/components/ui';

const meta = {
  title: 'Animation/HeartbeatLoader',
  component: HeartbeatLoader,
} satisfies Meta<typeof HeartbeatLoader>;

export default meta;
type Story = StoryObj<typeof meta>;

// Loop liên tục — tim đập + vòng sóng lan toả.
export const Default: Story = {};

export const WithLabel: Story = { args: { label: 'Đang tải…' } };

export const Sizes: Story = {
  render: () => (
    <View className="gap-8 items-center">
      <HeartbeatLoader size={40} />
      <HeartbeatLoader size={64} label="Đang đồng bộ kỷ niệm…" />
      <HeartbeatLoader size={96} />
    </View>
  ),
};
