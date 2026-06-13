import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Pill } from '../../src/components/ui';

const meta = {
  title: 'UI/Pill',
  component: Pill,
  args: { label: 'Tất cả' },
} satisfies Meta<typeof Pill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Active: Story = { args: { active: true } };

export const FilterRow: Story = {
  render: () => (
    <View className="flex-row gap-2">
      <Pill label="Tất cả" active />
      <Pill label="Ký ức" />
      <Pill label="Cột mốc" />
      <Pill label="Quà tặng" />
    </View>
  ),
};
