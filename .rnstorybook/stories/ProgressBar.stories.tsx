import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { ProgressBar } from '../../src/components/ui';

const meta = {
  title: 'UI/ProgressBar',
  component: ProgressBar,
  args: { value: 0.6 },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Thick: Story = { args: { height: 12 } };

export const AllColors: Story = {
  render: () => (
    <View className="gap-3">
      {(['accent', 'success', 'warning', 'error'] as const).map((color, i) => (
        <ProgressBar key={color} value={(i + 1) * 0.22} color={color} />
      ))}
    </View>
  ),
};
