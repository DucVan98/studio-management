import { useEffect, useState } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

/**
 * Mưa confetti ăn mừng — chạy một lần khi mount. Đặt BÊN TRONG một container
 * `relative` (absolute inset-0), vd phủ lên màn "Đã kết nối", mở khoá cột mốc.
 *
 * Tôn trọng Reduce Motion: không hiển thị gì.
 *
 * @example
 * <View className="relative">
 *   <Confetti />
 *   ...nội dung...
 * </View>
 */

const PALETTE = ['#E94B7B', '#F6C667', '#7B4397', '#7BE0A3', '#FF7BA3'];

interface ConfettiProps {
  /** Số mảnh giấy. Mặc định 24. */
  count?: number;
  /** Quãng rơi (px). Mặc định 360. */
  fallDistance?: number;
  /** Thời lượng rơi (ms). Mặc định 1600. */
  durationMs?: number;
  /** Bảng màu. */
  palette?: string[];
}

function Piece({
  index,
  palette,
  fallDistance,
  durationMs,
}: {
  index: number;
  palette: string[];
  fallDistance: number;
  durationMs: number;
}) {
  const p = useSharedValue(0);

  // Tham số ngẫu nhiên cố định cho mỗi mảnh — tính một lần qua lazy initializer của
  // useState (không chạy lại giữa các render), tránh gọi Math.random() trong thân render.
  const [cfg] = useState(() => ({
    left: Math.random(),
    delay: Math.random() * 250,
    drift: (Math.random() * 2 - 1) * 70,
    rot: (Math.random() * 4 - 2) * 360,
    color: palette[index % palette.length],
    w: 6 + Math.random() * 6,
    h: 10 + Math.random() * 8,
  }));

  useEffect(() => {
    p.set(withDelay(cfg.delay, withTiming(1, { duration: durationMs, easing: Easing.in(Easing.quad) })));
  }, [p, cfg.delay, durationMs]);

  const style = useAnimatedStyle(() => ({
    opacity: interpolate(p.value, [0, 0.1, 0.85, 1], [0, 1, 1, 0]),
    transform: [
      { translateY: p.value * fallDistance },
      { translateX: p.value * cfg.drift },
      { rotate: `${p.value * cfg.rot}deg` },
    ],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      className="absolute rounded-sm"
      style={[{ top: 0, left: `${cfg.left * 100}%`, width: cfg.w, height: cfg.h, backgroundColor: cfg.color }, style]}
    />
  );
}

export function Confetti({ count = 24, fallDistance = 360, durationMs = 1600, palette = PALETTE }: ConfettiProps) {
  const reduced = useReducedMotion();
  if (reduced) return null;

  return (
    <View pointerEvents="none" className="absolute inset-0 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <Piece key={i} index={i} palette={palette} fallDistance={fallDistance} durationMs={durationMs} />
      ))}
    </View>
  );
}
