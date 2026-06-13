import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { GiftCard } from '../../src/components/ui';

const meta = {
  title: 'UI/GiftCard',
  component: GiftCard,
  args: { name: 'Hoa hồng', price: '150.000đ' },
} satisfies Meta<typeof GiftCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const NoPrice: Story = { args: { price: undefined, icon: 'star' } };

export const Row: Story = {
  render: () => (
    <View className="flex-row gap-3">
      <GiftCard icon="gift" name="Hoa hồng" price="150.000đ" />
      <GiftCard icon="heart" name="Socola" price="90.000đ" />
      <GiftCard icon="star" name="Gấu bông" price="250.000đ" />
    </View>
  ),
};
