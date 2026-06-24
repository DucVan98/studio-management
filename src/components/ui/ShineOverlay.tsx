import { useEffect, useState } from 'react';
import { View } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

/**
 * Vệt sáng quét chéo qua — dùng cho thẻ cao cấp (Couple Pro), huy hiệu, banner
 * để tạo cảm giác "sang". Đặt BÊN TRONG một container `relative overflow-hidden`.
 *
 * @example
 * <View className="relative overflow-hidden rounded-2xl bg-[#221C1F] p-5">
 *   <Text className="text-[#F6C667] font-bold">Couple Pro</Text>
 *   <ShineOverlay loop />
 * </View>
 */

interface ShineOverlayProps {
  /** Màu dải sáng. Mặc định trắng mờ. */
  color?: string;
  /** Lặp vô hạn thay vì chạy một lần. Mặc định false. */
  loop?: boolean;
  /** Thời lượng mỗi lần quét (ms). Mặc định 1200. */
  durationMs?: number;
  /** Trễ trước khi bắt đầu (ms). Mặc định 300. */
  delayMs?: number;
  /** Bề rộng dải sáng so với container (0–1). Mặc định 0.35. */
  widthRatio?: number;
}

export function ShineOverlay({
  color = 'rgba(255,255,255,0.5)',
  loop = false,
  durationMs = 1200,
  delayMs = 300,
  widthRatio = 0.35,
}: ShineOverlayProps) {
  const reduced = useReducedMotion();
  const [w, setW] = useState(0);
  const p = useSharedValue(0);

  useEffect(() => {
    if (reduced || w === 0) return;
    const sweep = withTiming(1, { duration: durationMs, easing: Easing.inOut(Easing.ease) });
    p.value = loop
      ? withDelay(delayMs, withRepeat(sweep, -1, false))
      : withDelay(delayMs, sweep);
  }, [reduced, w, loop, durationMs, delayMs, p]);

  const bandWidth = w * widthRatio;
  const style = useAnimatedStyle(() => ({
    opacity: interpolate(p.value, [0, 0.1, 0.9, 1], [0, 0.9, 0.9, 0]),
    transform: [
      { translateX: interpolate(p.value, [0, 1], [-bandWidth - w * 0.2, w]) },
      { skewX: '-20deg' },
    ],
  }));

  const onLayout = (e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width);

  return (
    <View className="absolute inset-0 overflow-hidden" pointerEvents="none" onLayout={onLayout}>
      {!reduced && w > 0 && (
        <Animated.View
          style={[{ position: 'absolute', top: 0, bottom: 0, width: bandWidth, backgroundColor: color }, style]}
        />
      )}
    </View>
  );
}
