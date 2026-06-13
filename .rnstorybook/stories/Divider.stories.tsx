import type { Meta, StoryObj } from '@storybook/react-native';

import { Divider } from '../../src/components/ui';

const meta = {
  title: 'UI/Divider',
  component: Divider,
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithLabel: Story = { args: { label: 'hoặc' } };
export const SpacingLarge: Story = { args: { spacing: 'lg' } };
