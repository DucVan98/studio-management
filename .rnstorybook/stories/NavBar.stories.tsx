import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { NavBar } from '../../src/components/ui';

const meta = {
  title: 'UI/NavBar',
  component: NavBar,
  // NavBar position absolute bottom → cần container có chiều cao cố định.
  decorators: [
    Story => (
      <View className="bg-surface-alt rounded-2xl overflow-hidden" style={{ height: 220 }}>
        <Story />
      </View>
    ),
  ],
  args: { activeTab: 'home' },
} satisfies Meta<typeof NavBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Home: Story = {};
export const Memories: Story = { args: { activeTab: 'memories' } };
export const Profile: Story = { args: { activeTab: 'profile' } };
