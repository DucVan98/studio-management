import { useEffect } from 'react';
import { TextInput } from 'react-native';
import type { TextInputProps } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

/**
 * Số chạy tăng dần (count-up) — chạy hoàn toàn trên UI thread qua Reanimated.
 * Dùng cho bộ đếm "ngày bên nhau", điểm số AI, thống kê…
 *
 * Cập nhật giá trị hiển thị bằng animatedProps trên TextInput (editable={false})
 * thay vì re-render React mỗi frame → mượt 60fps.
 *
 * @example
 * <AnimatedCounter value={1024} className="text-display-lg font-bold text-on-accent" />
 */

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface AnimatedCounterProps {
  /** Giá trị đích cần đếm tới. */
  value: number;
  /** Thời lượng animation (ms). Mặc định 1200. */
  durationMs?: number;
  /** Ký tự phân tách hàng nghìn. Mặc định '.' (vi-VN). */
  groupSeparator?: string;
  className?: string;
}

/** Định dạng số nguyên có phân tách hàng nghìn — chạy được trong worklet. */
function formatGrouped(n: number, sep: string): string {
  'worklet';
  const s = Math.round(n).toString();
  let out = '';
  let count = 0;
  for (let i = s.length - 1; i >= 0; i -= 1) {
    out = s[i] + out;
    count += 1;
    if (count % 3 === 0 && i !== 0) out = sep + out;
  }
  return out;
}

export function AnimatedCounter({
  value,
  durationMs = 1200,
  groupSeparator = '.',
  className = '',
}: AnimatedCounterProps) {
  const progress = useSharedValue(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    // Reduce Motion: hiện thẳng giá trị, bỏ qua đếm.
    progress.value = reduced
      ? value
      : withTiming(value, { duration: durationMs, easing: Easing.out(Easing.cubic) });
  }, [value, durationMs, reduced, progress]);

  const animatedProps = useAnimatedProps(() => {
    // `text` là prop nội bộ của TextInput dùng để set giá trị từ UI thread.
    return { text: formatGrouped(progress.value, groupSeparator) } as Partial<TextInputProps>;
  });

  return (
    <AnimatedTextInput
      className={className}
      editable={false}
      // Giá trị đầu (trước khi worklet chạy) để không nhấp nháy.
      defaultValue={formatGrouped(0, groupSeparator)}
      animatedProps={animatedProps}
      // Tránh padding/đường gạch mặc định của TextInput để khớp <Text>.
      underlineColorAndroid="transparent"
      pointerEvents="none"
    />
  );
}
