import { useEffect, useState } from 'react';
import { View } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

/**
 * Figma ProgressBar — thin track với filled portion bg-accent.
 * Phần fill chạy mượt (spring/timing) mỗi khi `value` đổi, thay vì nhảy đột ngột.
 */

type BarColor = 'accent' | 'success' | 'warning' | 'error';

const COLOR_MAP: Record<BarColor, string> = {
  accent:  'bg-accent',
  success: 'bg-success',
  warning: 'bg-warning',
  error:   'bg-error',
};

interface ProgressBarProps {
  /** 0–1 */
  value: number;
  color?: BarColor;
  /** Height in px, default 6 */
  height?: number;
  /** Thời lượng animation (ms). Mặc định 600. */
  durationMs?: number;
  className?: string;
}

export function ProgressBar({
  value,
  color = 'accent',
  height = 6,
  durationMs = 600,
  className = '',
}: ProgressBarProps) {
  const clamped = Math.min(1, Math.max(0, value));
  const [trackWidth, setTrackWidth] = useState(0);
  const progress = useSharedValue(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    progress.value = reduced
      ? clamped
      : withTiming(clamped, { duration: durationMs, easing: Easing.out(Easing.cubic) });
  }, [clamped, durationMs, reduced, progress]);

  const fillStyle = useAnimatedStyle(() => ({ width: trackWidth * progress.value }));

  const onLayout = (e: LayoutChangeEvent) => setTrackWidth(e.nativeEvent.layout.width);

  return (
    <View
      className={`w-full bg-surface-alt rounded-pill overflow-hidden ${className}`}
      style={{ height }}
      onLayout={onLayout}
    >
      <Animated.View className={`h-full rounded-pill ${COLOR_MAP[color]}`} style={fillStyle} />
    </View>
  );
}
