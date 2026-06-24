import { useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { Icon } from './Icon';
import { HeartbeatLoader } from './HeartbeatLoader';

/**
 * ScrollView "kéo để làm mới" với chỉ báo hình trái tim: kéo xuống → tim hiện &
 * lớn dần; thả tay khi đủ ngưỡng → hiện HeartbeatLoader tới khi `onRefresh` xong.
 *
 * Chỉ báo nằm dưới nội dung ở đỉnh, lộ ra khi kéo (hiệu ứng iOS bounce).
 *
 * @example
 * <HeartPullToRefresh onRefresh={() => queryClient.invalidateQueries(...)}>
 *   <Feed />
 * </HeartPullToRefresh>
 */

interface HeartPullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  children: ReactNode;
  /** Ngưỡng kéo (px) để kích hoạt. Mặc định 90. */
  threshold?: number;
  className?: string;
}

export function HeartPullToRefresh({
  onRefresh,
  children,
  threshold = 90,
  className,
}: HeartPullToRefreshProps) {
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: e => {
      scrollY.value = e.contentOffset.y;
    },
  });

  const trigger = useCallback(() => {
    if (refreshing) return;
    setRefreshing(true);
    Promise.resolve(onRefresh()).finally(() => setRefreshing(false));
  }, [refreshing, onRefresh]);

  const onScrollEndDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (e.nativeEvent.contentOffset.y <= -threshold) trigger();
  };

  // Tim hiện & lớn dần theo quãng kéo (scrollY âm khi kéo xuống).
  const heartStyle = useAnimatedStyle(() => {
    const pull = Math.max(0, -scrollY.value);
    const p = Math.min(1, pull / threshold);
    return { opacity: p, transform: [{ scale: 0.4 + p * 0.6 }] };
  });

  return (
    <View className={`flex-1 ${className ?? ''}`}>
      {/* Chỉ báo ở đỉnh — nằm dưới nội dung */}
      <View
        className="absolute top-0 left-0 right-0 items-center justify-center"
        style={{ height: threshold }}
        pointerEvents="none"
      >
        {refreshing ? (
          <HeartbeatLoader size={28} />
        ) : (
          <Animated.View style={heartStyle}>
            <Icon name="heart" size={30} color="var(--color-accent)" />
          </Animated.View>
        )}
      </View>

      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        onScrollEndDrag={onScrollEndDrag}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: refreshing ? threshold : 0 }}
      >
        {children}
      </Animated.ScrollView>
    </View>
  );
}
