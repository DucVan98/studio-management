import { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

/**
 * Figma Skeleton / loading placeholder — shimmer opacity pulse
 * Dùng khi đang fetch data thay thế cho component thật
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

function SkeletonBase({ width, height, radius = 8, className = '' }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1,   duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return (
    <Animated.View
      className={`bg-surface-alt ${className}`}
      style={{ width, height, borderRadius: radius, opacity }}
    />
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
