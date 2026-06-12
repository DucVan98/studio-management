import type { Meta, StoryObj } from '@storybook/react-native';
import { Text, View } from 'react-native';

import { Card } from '../../src/components/ui';

const meta = {
  title: 'UI/Card',
  component: Card,
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Elevations: Story = {
  args: { children: null },
  render: () => (
    <View className="gap-4">
      {(['flat', 'sm', 'md', 'lg'] as const).map(elevation => (
        <Card key={elevation} elevation={elevation} className="p-5">
          <Text className="text-body-md text-text">elevation = {elevation}</Text>
        </Card>
      ))}
    </View>
  ),
};
