import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { View, Text } from 'react-native';

import { OtpInput } from '../../src/components/ui';

const meta = {
  title: 'Animation/OtpInput',
  component: OtpInput,
} satisfies Meta<typeof OtpInput>;

export default meta;
type Story = StoryObj<typeof meta>;

function OtpDemo({ length = 6 }: { length?: number }) {
  const [code, setCode] = useState('');
  return (
    <View className="items-center gap-4">
      <Text className="text-body-md text-text-muted">Nhập mã xác thực</Text>
      <OtpInput value={code} onChange={setCode} length={length} />
      <Text className="text-body-sm text-text-muted">Mã: {code || '—'}</Text>
    </View>
  );
}

// Bấm vào dãy ô để gõ — mỗi ô "phồng" lên khi điền.
export const SixDigits: Story = { render: () => <OtpDemo length={6} /> };
export const FourDigits: Story = { render: () => <OtpDemo length={4} /> };
