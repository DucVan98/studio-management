import { useEffect } from 'react';
import { View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useThemeColors } from '../../tokens/useThemeColors';

/**
 * Loader "chữ ký" của Everly — trái tim ĐẶC đập theo nhịp tim, kèm các sóng
 * hình trái tim lan toả ra rồi mờ dần. Dùng thay ActivityIndicator ở màn chờ
 * toàn trang (boot, fetch lớn, đồng bộ).
 *
 * @example
 * <HeartbeatLoader />
 * <HeartbeatLoader size={48} label={t('common.loading')} />
 */

// Path trái tim đóng kín (trùng icon set) — tô đặc thay vì vẽ viền.
const HEART_PATH =
  'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z';

function FilledHeart({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d={HEART_PATH} fill={color} />
    </Svg>
  );
}

interface HeartbeatLoaderProps {
  /** Đường kính trái tim (px). Mặc định 64. */
  size?: number;
  /** Text hiển thị dưới loader (vd "Đang tải…"). */
  label?: string;
}

const RIPPLE_DURATION = 1800;

export function HeartbeatLoader({ size = 64, label }: HeartbeatLoaderProps) {
  const colors = useThemeColors();
  const accent = colors['--color-accent'];
  const reduced = useReducedMotion();

  const beat = useSharedValue(1);
  const ripple1 = useSharedValue(0);
  const ripple2 = useSharedValue(0);

  useEffect(() => {
    if (reduced) return;
    // Nhịp đôi giống tim thật: mạnh – nghỉ – nhẹ – nghỉ dài.
    beat.value = withRepeat(
      withSequence(
        withTiming(1.18, { duration: 150, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 200 }),
        withTiming(1.12, { duration: 150, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 380 }),
      ),
      -1,
    );
    // Hai sóng hình tim lan ra, lệch pha nửa chu kỳ.
    ripple1.value = withRepeat(withTiming(1, { duration: RIPPLE_DURATION, easing: Easing.out(Easing.ease) }), -1, false);
    ripple2.value = withDelay(
      RIPPLE_DURATION / 2,
      withRepeat(withTiming(1, { duration: RIPPLE_DURATION, easing: Easing.out(Easing.ease) }), -1, false),
    );
  }, [reduced, beat, ripple1, ripple2]);

  const heartStyle = useAnimatedStyle(() => ({ transform: [{ scale: beat.value }] }));
  const ripple1Style = useAnimatedStyle(() => ({
    opacity: interpolate(ripple1.value, [0, 1], [0.4, 0]),
    transform: [{ scale: interpolate(ripple1.value, [0, 1], [1, 2.1]) }],
  }));
  const ripple2Style = useAnimatedStyle(() => ({
    opacity: interpolate(ripple2.value, [0, 1], [0.4, 0]),
    transform: [{ scale: interpolate(ripple2.value, [0, 1], [1, 2.1]) }],
  }));

  const box = size * 2.2;

  return (
    <View className="items-center justify-center gap-3">
      <View className="items-center justify-center" style={{ width: box, height: box }}>
        {!reduced && (
          <>
            <Animated.View className="absolute" style={ripple1Style} pointerEvents="none">
              <FilledHeart size={size} color={accent} />
            </Animated.View>
            <Animated.View className="absolute" style={ripple2Style} pointerEvents="none">
              <FilledHeart size={size} color={accent} />
            </Animated.View>
          </>
        )}
        <Animated.View style={heartStyle}>
          <FilledHeart size={size} color={accent} />
        </Animated.View>
      </View>
      {label ? <Text className="text-body-sm font-medium text-text-muted">{label}</Text> : null}
    </View>
  );
}
