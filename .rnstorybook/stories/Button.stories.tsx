import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Button } from '../../src/components/ui';

const meta = {
  title: 'UI/Button',
  component: Button,
  args: { label: 'Tiếp tục' },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Danger: Story = { args: { variant: 'danger', label: 'Xoá' } };
export const Loading: Story = { args: { loading: true } };
export const WithIcons: Story = { args: { leftIcon: 'heart', rightIcon: 'chevron-right' } };
export const FullWidth: Story = { args: { fullWidth: true } };

export const AllVariants: Story = {
  render: () => (
    <View className="gap-3 items-start">
      <Button label="Primary" />
      <Button label="Secondary" variant="secondary" />
      <Button label="Ghost" variant="ghost" />
      <Button label="Danger" variant="danger" />
      <Button label="Small" size="sm" />
      <Button label="Large" size="lg" />
      <Button label="Disabled" disabled />
      <Button label="Loading" loading />
    </View>
  ),
};
