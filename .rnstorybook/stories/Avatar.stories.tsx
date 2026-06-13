import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Avatar, AvatarPair } from '../../src/components/ui';

const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  args: { name: 'Anh', size: 'md' },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Initial: Story = {};
export const WithImage: Story = { args: { uri: 'https://i.pravatar.cc/160?img=5' } };

export const AllSizes: Story = {
  render: () => (
    <View className="flex-row items-end gap-3">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(size => (
        <Avatar key={size} name="A" size={size} />
      ))}
    </View>
  ),
};

export const AllColors: Story = {
  render: () => (
    <View className="flex-row gap-3">
      {(['accent', 'rose', 'violet', 'sky', 'amber'] as const).map(color => (
        <Avatar key={color} name={color.charAt(0)} color={color} />
      ))}
    </View>
  ),
};

export const Pair: Story = {
  render: () => (
    <AvatarPair left={{ name: 'Anh' }} right={{ name: 'Em' }} size="lg" />
  ),
};
