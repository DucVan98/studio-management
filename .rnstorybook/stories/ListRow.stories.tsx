import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

import { Divider, ListRow } from '../../src/components/ui';

const meta = {
  title: 'UI/ListRow',
  component: ListRow,
  args: { label: 'Thông báo', icon: 'bell' },
} satisfies Meta<typeof ListRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const NoChevron: Story = { args: { showChevron: false } };
export const CustomRightIcon: Story = { args: { rightIcon: 'check' } };

export const SettingsList: Story = {
  render: () => (
    <View className="bg-surface rounded-2xl overflow-hidden">
      <ListRow icon="bell" label="Thông báo" />
      <Divider spacing="sm" className="my-0 mx-4" />
      <ListRow icon="settings" label="Cài đặt" />
      <Divider spacing="sm" className="my-0 mx-4" />
      <ListRow icon="lock" label="Bảo mật" />
    </View>
  ),
};
