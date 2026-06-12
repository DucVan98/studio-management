import type { Meta, StoryObj } from '@storybook/react-native';

import { EmptyState } from '../../src/components/ui';

const meta = {
  title: 'UI/EmptyState',
  component: EmptyState,
  args: {
    title: 'Chưa có kỷ niệm nào',
    subtitle: 'Hãy lưu lại khoảnh khắc đầu tiên của hai bạn nhé',
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAction: Story = {
  args: {
    icon: 'camera',
    actionLabel: 'Thêm kỷ niệm',
    onAction: () => {},
  },
};
