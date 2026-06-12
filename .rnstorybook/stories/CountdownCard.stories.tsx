import type { Meta, StoryObj } from '@storybook/react-native';

import { CountdownCard } from '../../src/components/ui';

const meta = {
  title: 'UI/CountdownCard',
  component: CountdownCard,
} satisfies Meta<typeof CountdownCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Together: Story = {
  args: { variant: 'together', startDate: new Date('2022-02-14') },
};

export const Countdown: Story = {
  args: {
    variant: 'countdown',
    targetDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    label: 'Kỷ niệm 5 năm',
    icon: 'star',
  },
};
