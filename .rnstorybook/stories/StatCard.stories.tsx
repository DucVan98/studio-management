import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { StatCard } from '../../src/components/ui';

const meta = {
  title: 'UI/StatCard',
  component: StatCard,
  args: { value: '365', label: 'Ngày bên nhau' },
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Row: Story = {
  render: () => (
    <View className="flex-row gap-3">
      <StatCard value="365" label="Ngày bên nhau" />
      <StatCard value="12" label="Ký ức" />
      <StatCard value="4" label="Cột mốc" />
    </View>
  ),
};
