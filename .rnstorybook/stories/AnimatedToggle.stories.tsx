import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { View, Text } from 'react-native';

import { AnimatedToggle } from '../../src/components/ui';

const meta = {
  title: 'Animation/AnimatedToggle',
  component: AnimatedToggle,
} satisfies Meta<typeof AnimatedToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

function ToggleRow({ label, initial = false, disabled }: { label: string; initial?: boolean; disabled?: boolean }) {
  const [on, setOn] = useState(initial);
  return (
    <View className="flex-row items-center justify-between bg-surface rounded-2xl px-4 py-3" style={{ width: 280 }}>
      <Text className="text-body-md text-text">{label}</Text>
      <AnimatedToggle value={on} onValueChange={setOn} disabled={disabled} />
    </View>
  );
}

export const Interactive: Story = {
  render: () => (
    <View className="gap-3">
      <ToggleRow label="Thông báo đẩy" initial />
      <ToggleRow label="Nhắc kỷ niệm" />
      <ToggleRow label="Chế độ tối" />
      <ToggleRow label="Đã khoá (bật)" initial disabled />
    </View>
  ),
};
