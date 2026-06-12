import type { Meta, StoryObj } from '@storybook/react-native';

import { SectionHeader } from '../../src/components/ui';

const meta = {
  title: 'UI/SectionHeader',
  component: SectionHeader,
  args: { title: 'Kỷ niệm gần đây' },
} satisfies Meta<typeof SectionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithAction: Story = {
  args: { actionLabel: 'Xem tất cả', onAction: () => {} },
};
