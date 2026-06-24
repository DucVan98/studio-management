import type { Meta, StoryObj } from '@storybook/react-native';
import { View, Text, ScrollView } from 'react-native';

import {
  ParallaxScrollView,
  Icon,
  Pill,
  StatCard,
  MemoryCard,
  ListRow,
  Button,
  AnimatedListItem,
} from '../../src/components/ui';

const HERO = 'https://picsum.photos/seed/everly-dalat/800/600';
const GALLERY = [
  'https://picsum.photos/seed/everly-g1/300/300',
  'https://picsum.photos/seed/everly-g2/300/300',
  'https://picsum.photos/seed/everly-g3/300/300',
  'https://picsum.photos/seed/everly-g4/300/300',
];

const meta = {
  title: 'Animation/ParallaxScrollView',
  component: ParallaxScrollView,
  // Khung cao như màn điện thoại để cuộn & thấy parallax rõ.
  decorators: [
    Story => (
      <View className="rounded-3xl overflow-hidden bg-bg" style={{ height: 640, width: 320 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof ParallaxScrollView>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Overlay trên ảnh hero: nút back + tiêu đề + ngày. */
function HeaderOverlay() {
  return (
    <View className="flex-1 justify-between p-4">
      <View className="flex-row justify-between">
        <View className="w-9 h-9 rounded-full bg-black/30 items-center justify-center">
          <Icon name="chevron-left" size="md" color="#FFFFFF" />
        </View>
        <View className="w-9 h-9 rounded-full bg-black/30 items-center justify-center">
          <Icon name="heart" size="md" color="#FFFFFF" />
        </View>
      </View>
      <View>
        <Text className="text-heading-xl font-bold text-white">Chuyến đi Đà Lạt</Text>
        <View className="flex-row items-center gap-1 mt-1">
          <Icon name="map-pin" size="xs" color="#FFFFFF" />
          <Text className="text-body-sm text-white/90">Đà Lạt · 12–15/06/2024</Text>
        </View>
      </View>
    </View>
  );
}

// Cuộn lên/xuống để xem ảnh hero parallax + zoom khi kéo xuống.
export const MemoryDetail: Story = {
  render: () => (
    <ParallaxScrollView imageUri={HERO} headerHeight={240} headerOverlay={<HeaderOverlay />}>
      <View className="p-4 gap-5">
        {/* Loại kỷ niệm */}
        <View className="flex-row gap-2">
          <Pill label="Du lịch" active />
          <Pill label="#dalat" />
          <Pill label="2024" />
        </View>

        {/* Thống kê */}
        <View className="flex-row gap-3">
          <StatCard value="4" label="Ngày" />
          <StatCard value="128" label="Ảnh" />
          <StatCard value="3" label="Địa điểm" />
        </View>

        {/* Mô tả */}
        <View className="gap-1">
          <Text className="text-heading-md font-bold text-text">Kỷ niệm</Text>
          <Text className="text-body-md text-text-muted leading-6">
            Chuyến đi đầu tiên của hai đứa. Trời se lạnh, ăn bánh tráng nướng ở chợ đêm, chụp ảnh
            bên hồ Xuân Hương và lạc đường trong vườn dâu — nhưng vui kinh khủng 💕
          </Text>
        </View>

        {/* Gallery ngang */}
        <View className="gap-2">
          <Text className="text-heading-md font-bold text-text">Hình ảnh</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-3 pr-4">
            {GALLERY.map((uri, i) => (
              <MemoryCard key={i} type="compact" title={`Khoảnh khắc ${i + 1}`} tag="#dalat" imageUri={uri} />
            ))}
          </ScrollView>
        </View>

        {/* Dòng thời gian */}
        <View className="gap-1">
          <Text className="text-heading-md font-bold text-text">Dòng thời gian</Text>
          <View className="bg-surface rounded-2xl overflow-hidden">
            {['Khởi hành từ Sài Gòn', 'Check-in homestay', 'Dạo chợ đêm', 'Về nhà'].map((label, i) => (
              <AnimatedListItem key={label} index={i}>
                <ListRow label={label} icon="map-pin" />
              </AnimatedListItem>
            ))}
          </View>
        </View>

        <Button label="Chỉnh sửa kỷ niệm" variant="secondary" fullWidth leftIcon="edit-2" />
        <View className="h-4" />
      </View>
    </ParallaxScrollView>
  ),
};

// Phiên bản tối giản để so sánh hành vi parallax thuần.
export const Minimal: Story = {
  render: () => (
    <ParallaxScrollView imageUri={HERO} headerHeight={220}>
      <View className="p-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <View key={i} className="bg-surface-alt rounded-xl px-4 py-5">
            <Text className="text-body-md text-text">Mục #{i + 1}</Text>
          </View>
        ))}
      </View>
    </ParallaxScrollView>
  ),
};
