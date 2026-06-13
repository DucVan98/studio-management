import type { Meta, StoryObj } from '@storybook/react-native';

import { Badge } from '../../src/components/ui';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  args: { label: 'Hôm nay', icon: 'heart' },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithIcon: Story = {};
export const LabelOnly: Story = { args: { label: '3 kỷ niệm', icon: undefined } };
