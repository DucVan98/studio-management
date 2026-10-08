import { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Icon } from './Icon';
import type { IconName } from './Icon';


/**
 * Huy hiệu mở khoá thử thách/cột mốc — bật ra (pop: scale + xoay nhẹ) kèm vệt
 * sáng quét qua, và rung haptic "success" khi xuất hiện.
 *
 * @example
 * <AchievementBadge icon="award" label="1000 ngày bên nhau" />
 */

interface AchievementBadgeProps {
  /** Icon trong huy hiệu. Mặc định 'award'. */
  icon?: IconName;
  /** Nhãn dưới huy hiệu. */
  label?: string;
  /** Đường kính huy hiệu (px). Mặc định 96. */
  size?: number;
}

export function AchievementBadge({ icon = 'award', label, size = 96 }: AchievementBadgeProps) {
  const reduced = useReducedMotion();

  const scale = useSharedValue(reduced ? 1 : 0);
  const rotate = useSharedValue(reduced ? 0 : -40);
  const shine = useSharedValue(0);

  useEffect(() => {
    // Khoảnh khắc "ăn mừng" → rung success.
    haptics.notify('success');
    if (reduced) return;
    scale.value = withSpring(1, { damping: 9, stiffness: 120 });
    rotate.value = withSpring(0, { damping: 10, stiffness: 120 });
    shine.value = withDelay(500, withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }));
  }, [reduced, haptics, scale, rotate, shine]);

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
  }));

  const shineStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shine.value, [0, 0.1, 0.9, 1], [0, 0.8, 0.8, 0]),
    transform: [
      { translateX: interpolate(shine.value, [0, 1], [-size, size * 1.4]) },
      { skewX: '-20deg' },
    ],
  }));

  return (
    <View className="items-center gap-3">
      <Animated.View
        className="rounded-full bg-accent items-center justify-center overflow-hidden shadow-md"
        style={[{ width: size, height: size }, badgeStyle]}
      >
        <Icon name={icon} size={Math.round(size * 0.42)} color="#FFFFFF" />
        {/* Vệt sáng quét qua */}
        <Animated.View
          className="absolute top-0 bottom-0 bg-white/70"
          style={[{ width: size * 0.35 }, shineStyle]}
          pointerEvents="none"
        />
      </Animated.View>
      {label ? (
        <Text className="text-body-sm font-semibold text-text text-center" numberOfLines={2}>
          {label}
        </Text>
      ) : null}
    </View>
  );
}
