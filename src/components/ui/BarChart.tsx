import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

/**
 * Biểu đồ cột đơn giản — các cột "mọc" lên từ đáy, lệch nhau trái→phải (stagger).
 * Dùng cho thống kê tương tác hàng tuần ở AI Insights / Khám phá.
 *
 * @example
 * <BarChart values={[3, 5, 2, 7, 4]} />
 */

interface BarChartProps {
  /** Giá trị mỗi cột (số bất kỳ ≥ 0). */
  values: number[];
  /** Chiều cao vùng biểu đồ (px). Mặc định 130. */
  height?: number;
  /** Bề rộng mỗi cột (px). Mặc định 20. */
  barWidth?: number;
  /** Khoảng cách giữa các cột (px). Mặc định 9. */
  gap?: number;
  /** Độ trễ stagger mỗi cột (ms). Mặc định 80. */
  stagger?: number;
}

function Bar({
  fraction,
  index,
  maxHeight,
  width,
  stagger,
}: {
  fraction: number;
  index: number;
  maxHeight: number;
  width: number;
  stagger: number;
}) {
  const reduced = useReducedMotion();
  const h = useSharedValue(0);
  const target = fraction * maxHeight;

  useEffect(() => {
    h.value = reduced
      ? target
      : withDelay(index * stagger, withTiming(target, { duration: 600, easing: Easing.out(Easing.cubic) }));
  }, [target, index, stagger, reduced, h]);

  const style = useAnimatedStyle(() => ({ height: h.value }));

  return <Animated.View className="rounded-t-md bg-accent" style={[{ width }, style]} />;
}

export function BarChart({
  values,
  height = 130,
  barWidth = 20,
  gap = 9,
  stagger = 80,
}: BarChartProps) {
  const max = Math.max(1, ...values);

  return (
    <View className="flex-row items-end" style={{ height, gap }}>
      {values.map((v, i) => (
        <Bar
          key={i}
          index={i}
          fraction={v / max}
          maxHeight={height}
          width={barWidth}
          stagger={stagger}
        />
      ))}
    </View>
  );
}
