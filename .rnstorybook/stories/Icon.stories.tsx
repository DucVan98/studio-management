import type { Meta, StoryObj } from '@storybook/react-native';
import { View, Text } from 'react-native';

import { Icon } from '../../src/components/ui';
import type { IconName } from '../../src/components/ui';

const ALL_ICONS: IconName[] = [
  'home', 'image', 'award', 'compass', 'user',
  'plus', 'bell', 'sliders', 'cloud', 'heart',
  'star', 'gift', 'camera', 'calendar', 'mail',
  'zap', 'send', 'copy', 'chevron-right', 'activity',
  'map-pin', 'sun', 'edit-2', 'lock', 'trash-2',
  'chevron-left', 'check', 'x', 'settings', 'search',
];

const meta = {
  title: 'UI/Icon',
  component: Icon,
  args: { name: 'heart', size: 'lg', color: '#D4537E' },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {};

export const AllIcons: Story = {
  render: () => (
    <View className="flex-row flex-wrap gap-4">
      {ALL_ICONS.map(name => (
        <View key={name} className="items-center gap-1 w-16">
          <Icon name={name} size="lg" color="var(--color-text)" />
          <Text className="text-label text-text-muted" numberOfLines={1}>{name}</Text>
        </View>
      ))}
    </View>
  ),
};
