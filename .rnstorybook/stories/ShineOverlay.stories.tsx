import type { Meta, StoryObj } from '@storybook/react-native';
import { View, Text } from 'react-native';

import { ShineOverlay } from '../../src/components/ui';
import { Replay } from './replay';

const meta = {
  title: 'Animation/ShineOverlay',
  component: ShineOverlay,
} satisfies Meta<typeof ShineOverlay>;

export default meta;
type Story = StoryObj<typeof meta>;

function ProCard({ loop }: { loop?: boolean }) {
  return (
    <View className="relative overflow-hidden rounded-2xl p-5 gap-1" style={{ width: 300, backgroundColor: '#221C1F' }}>
      <Text className="text-2xl">👑</Text>
      <Text className="text-heading-lg font-bold" style={{ color: '#F6C667' }}>
        Couple Pro
      </Text>
      <Text className="text-body-sm" style={{ color: '#CBBCC2' }}>
        Mở khoá toàn bộ tính năng cao cấp
      </Text>
      <ShineOverlay loop={loop} color="rgba(246,198,103,0.45)" />
    </View>
  );
}

// Vệt vàng quét lặp lại — cảm giác cao cấp.
export const PremiumLoop: Story = { render: () => <ProCard loop /> };

// Quét một lần khi mount — bấm "Phát lại".
export const Once: Story = {
  render: () => (
    <Replay>
      <ProCard />
    </Replay>
  ),
};
