import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { AnimatedListItem, ListRow, MemoryCard } from '../../src/components/ui';
import { Replay } from './replay';

const meta = {
  title: 'Animation/AnimatedListItem',
  component: AnimatedListItem,
} satisfies Meta<typeof AnimatedListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

const ROWS = ['Kỷ niệm đầu tiên', 'Chuyến đi Đà Lạt', 'Sinh nhật', 'Hội An', 'Tết 2025'];

// Danh sách fade + trượt lên theo tầng (stagger). Bấm "Phát lại" để xem lại.
export const ListStagger: Story = {
  render: () => (
    <Replay>
      <View className="gap-2" style={{ width: 320 }}>
        {ROWS.map((label, i) => (
          <AnimatedListItem key={label} index={i}>
            <ListRow label={label} icon="heart" />
          </AnimatedListItem>
        ))}
      </View>
    </Replay>
  ),
};

export const Cards: Story = {
  render: () => (
    <Replay>
      <View className="flex-row gap-3">
        {['Sapa', 'Huế', 'Đà Nẵng'].map((title, i) => (
          <AnimatedListItem key={title} index={i} stagger={120}>
            <MemoryCard type="compact" title={title} tag={`#${title.toLowerCase()}`} />
          </AnimatedListItem>
        ))}
      </View>
    </Replay>
  ),
};
