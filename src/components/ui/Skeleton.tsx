import { useEffect, useState } from 'react';
import { View } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

/**
 * Figma Skeleton / loading placeholder — vệt sáng (shimmer) quét qua nền.
 * Dùng khi đang fetch data thay thế cho component thật.
 *
 * Dùng Reanimated (UI thread) thay cho Animated cũ của RN → mượt hơn, đồng bộ
 * với phần animation còn lại của app. Tôn trọng Reduce Motion (đứng yên).
 *
 * @example
 * <Skeleton width="100%" height={80} radius={20} />
 * <Skeleton width={48} height={48} radius={9999} />  // avatar
 * <Skeleton.Card />   // MemoryCard preset
 * <Skeleton.ListRow />
 */

interface SkeletonProps {
  width: number | `${number}%` | '100%';
  height: number;
  radius?: number;
  className?: string;
}

const SHIMMER_DURATION = 1300;

function SkeletonBase({ width, height, radius = 8, className = '' }: SkeletonProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  const x = useSharedValue(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    x.value = withRepeat(withTiming(1, { duration: SHIMMER_DURATION, easing: Easing.linear }), -1, false);
  }, [reduced, x]);

  // Dải sáng rộng ~50% track, trượt từ trái qua phải.
  const bandWidth = trackWidth * 0.5;
  const bandStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(x.value, [0, 1], [-bandWidth, trackWidth]) }],
  }));

  const onLayout = (e: LayoutChangeEvent) => setTrackWidth(e.nativeEvent.layout.width);

  return (
    <View
      className={`bg-surface-alt overflow-hidden ${className}`}
      style={{ width, height, borderRadius: radius }}
      onLayout={onLayout}
    >
      {!reduced && trackWidth > 0 && (
        <Animated.View
          className="bg-white/40 h-full"
          style={[{ position: 'absolute', top: 0, bottom: 0, width: bandWidth }, bandStyle]}
          pointerEvents="none"
        />
      )}
    </View>
  );
}

function MemoryCardSkeleton() {
  return (
    <View className="bg-surface rounded-lg overflow-hidden shadow-sm" style={{ width: 340, height: 260 }}>
      <SkeletonBase width="100%" height={190} radius={0} />
      <View className="p-3 gap-2">
        <SkeletonBase width="60%" height={14} radius={7} />
        <SkeletonBase width="40%" height={11} radius={6} />
      </View>
    </View>
  );
}

function ListRowSkeleton() {
  return (
    <View className="flex-row items-center gap-3 px-4 py-4">
      <SkeletonBase width={20} height={20} radius={4} />
      <SkeletonBase width="70%" height={14} radius={7} />
    </View>
  );
}

function StatCardSkeleton() {
  return (
    <View className="bg-surface rounded-md items-center justify-center py-4 shadow-sm" style={{ width: 110 }}>
      <SkeletonBase width={40} height={24} radius={6} className="mb-2" />
      <SkeletonBase width={70} height={11} radius={6} />
    </View>
  );
}

export const Skeleton = Object.assign(SkeletonBase, {
  Card: MemoryCardSkeleton,
  ListRow: ListRowSkeleton,
  StatCard: StatCardSkeleton,
});
