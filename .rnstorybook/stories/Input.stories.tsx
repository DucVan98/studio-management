import type { Meta, StoryObj } from '@storybook/react-native';

import { Input } from '../../src/components/ui';

const meta = {
  title: 'UI/Input',
  component: Input,
  args: { label: 'Email', placeholder: 'ban@example.com' },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithHint: Story = { args: { hint: 'Dùng email đã đăng ký' } };
export const WithError: Story = { args: { error: 'Email không hợp lệ' } };
export const NoLabel: Story = { args: { label: undefined, placeholder: 'Tìm kiếm...' } };
