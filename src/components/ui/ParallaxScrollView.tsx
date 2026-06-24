import type { ReactNode } from 'react';
import { View, Image } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

/**
 * ScrollView có ảnh hero parallax: khi cuộn lên ảnh dịch chậm hơn nội dung, khi
 * kéo xuống ảnh phóng to (zoom). Dùng cho màn chi tiết kỷ niệm / Home hero.
 *
 * @example
 * <ParallaxScrollView imageUri={uri} headerHeight={260} headerOverlay={<Title/>}>
 *   <DetailContent />
 * </ParallaxScrollView>
 */

const AnimatedImage = Animated.createAnimatedComponent(Image);

interface ParallaxScrollViewProps {
  imageUri: string;
  children: ReactNode;
  /** Chiều cao ảnh hero (px). Mặc định 260. */
  headerHeight?: number;
  /** Nội dung phủ lên ảnh (tiêu đề, nút back…). */
  headerOverlay?: ReactNode;
  className?: string;
}

export function ParallaxScrollView({
  imageUri,
  children,
  headerHeight = 260,
  headerOverlay,
  className,
}: ParallaxScrollViewProps) {
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler(e => {
    scrollY.value = e.contentOffset.y;
  });

  const imageStyle = useAnimatedStyle(() => ({
    transform: [
      {
        // Cuộn lên: ảnh dịch chậm hơn (parallax). Kéo xuống: kéo giãn theo.
        translateY: interpolate(
          scrollY.value,
          [-headerHeight, 0, headerHeight],
          [-headerHeight / 2, 0, headerHeight * 0.5],
          Extrapolation.CLAMP,
        ),
      },
      {
        scale: interpolate(scrollY.value, [-headerHeight, 0], [2, 1], Extrapolation.CLAMP),
      },
    ],
  }));

  return (
    <Animated.ScrollView
      className={className}
      onScroll={onScroll}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ height: headerHeight }} className="overflow-hidden bg-surface-alt">
        <AnimatedImage
          source={{ uri: imageUri }}
          style={[{ width: '100%', height: headerHeight }, imageStyle]}
          resizeMode="cover"
        />
        {headerOverlay ? <View className="absolute inset-0">{headerOverlay}</View> : null}
      </View>
      <View className="bg-bg">{children}</View>
    </Animated.ScrollView>
  );
}
