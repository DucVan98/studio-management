import type { Meta, StoryObj } from '@storybook/react-native';

import { BarChart } from '../../src/components/ui';
import { Replay } from './replay';

const meta = {
  title: 'Animation/BarChart',
  component: BarChart,
  args: { values: [3, 5, 2, 7, 4] },
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// Cột mọc lên lần lượt khi mount.
export const Default: Story = {};

export const Replayable: Story = {
  render: () => (
    <Replay>
      <BarChart values={[4, 6, 3, 8, 5, 7, 9]} />
    </Replay>
  ),
};

export const Weekly: Story = {
  render: () => (
    <Replay>
      <BarChart values={[2, 4, 1, 5, 3, 6, 4]} barWidth={24} gap={12} />
    </Replay>
  ),
};
