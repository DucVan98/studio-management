import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedProps,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useThemeColors } from '../../tokens/useThemeColors';

/**
 * Vòng tiến trình tròn — vẽ dần tới `value` (0–1). Dùng cho điểm sức khỏe mối
 * quan hệ (AI score) ở tab Khám phá, tiến độ cột mốc…
 *
 * @example
 * <ProgressRing value={0.92}>
 *   <Text className="text-display-md font-bold text-accent">92</Text>
 * </ProgressRing>
 */

interface ProgressRingProps {
  /** 0–1 */
  value: number;
  /** Đường kính (px). Mặc định 130. */
  size?: number;
  /** Độ dày vòng (px). Mặc định 11. */
  strokeWidth?: number;
  /** Thời lượng animation (ms). Mặc định 1400. */
  durationMs?: number;
  /** Nội dung ở tâm vòng (số điểm, nhãn…). */
  children?: ReactNode;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function ProgressRing({
  value,
  size = 130,
  strokeWidth = 11,
  durationMs = 1400,
  children,
}: ProgressRingProps) {
  const colors = useThemeColors();
  const reduced = useReducedMotion();
  const clamped = Math.min(1, Math.max(0, value));

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = reduced
      ? clamped
      : withTiming(clamped, { duration: durationMs, easing: Easing.out(Easing.cubic) });
  }, [clamped, durationMs, reduced, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  return (
    <View className="items-center justify-center" style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        {/* Track nền */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors['--color-surface-alt']}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Phần đã hoàn thành — vẽ dần qua strokeDashoffset */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors['--color-accent']}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
        />
      </Svg>
      {/* Nội dung ở tâm */}
      <View className="absolute inset-0 items-center justify-center">{children}</View>
    </View>
  );
}
