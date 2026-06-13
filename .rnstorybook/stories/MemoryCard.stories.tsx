import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { MemoryCard } from '../../src/components/ui';

const IMAGE = 'https://picsum.photos/seed/everly/680/380';

const meta = {
  title: 'UI/MemoryCard',
  component: MemoryCard,
  args: {
    title: 'Chuyến đi Đà Lạt',
    tag: '#dalat',
    date: '12/06/2024',
    imageUri: IMAGE,
  },
} satisfies Meta<typeof MemoryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Full: Story = {};
export const FullNoImage: Story = { args: { imageUri: undefined } };

export const Compact: Story = {
  render: () => (
    <View className="flex-row gap-3">
      <MemoryCard type="compact" title="Sapa" tag="#sapa" imageUri={IMAGE} />
      <MemoryCard type="compact" title="Hội An" tag="#hoian" />
    </View>
  ),
};
