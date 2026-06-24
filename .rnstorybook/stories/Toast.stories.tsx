import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Toast, Button } from '../../src/components/ui';
import type { ToastType } from '../../src/components/ui';

const meta = {
  title: 'Animation/Toast',
  component: Toast,
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

function ToastDemo({ type, title, message }: { type: ToastType; title: string; message?: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <View className="relative" style={{ height: 180 }}>
      <Toast visible={visible} type={type} title={title} message={message} onHide={() => setVisible(false)} />
      <View className="flex-1 items-center justify-center">
        <Button label="Hiện toast" onPress={() => setVisible(true)} />
      </View>
    </View>
  );
}

export const Success: Story = {
  render: () => <ToastDemo type="success" title="Đã lưu kỷ niệm mới 💕" />,
};

export const ErrorToast: Story = {
  render: () => <ToastDemo type="error" title="Không thể kết nối" message="Vui lòng thử lại sau." />,
};

export const Info: Story = {
  render: () => <ToastDemo type="info" title="Có kỷ niệm mới" message="Nửa kia vừa thêm một kỷ niệm." />,
};
