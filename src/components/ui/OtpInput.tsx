import { useEffect, useRef } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

/**
 * Ô nhập OTP — mỗi ký tự khi điền vào "phồng" lên (pop) và viền chuyển sang
 * accent; ô đang chờ nhập được làm nổi. Dùng cho màn Xác thực email.
 *
 * Một TextInput ẩn nhận phím; các ô chỉ để hiển thị.
 *
 * @example
 * const [code, setCode] = useState('');
 * <OtpInput length={6} value={code} onChange={setCode} autoFocus />
 */

interface OtpInputProps {
  value: string;
  onChange: (next: string) => void;
  /** Số ô. Mặc định 6. */
  length?: number;
  autoFocus?: boolean;
}

function OtpCell({ char, active }: { char: string; active: boolean }) {
  const reduced = useReducedMotion();
  const scale = useSharedValue(1);
  const filled = char.length > 0;

  useEffect(() => {
    if (filled && !reduced) {
      scale.value = withSequence(withTiming(1.12, { duration: 110 }), withTiming(1, { duration: 150 }));
    }
  }, [filled, reduced, scale]);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View
      style={style}
      className={[
        'w-12 h-14 rounded-xl bg-surface items-center justify-center border-2',
        filled || active ? 'border-accent' : 'border-border',
      ].join(' ')}
    >
      <Text className="text-heading-lg font-bold text-text">{char}</Text>
    </Animated.View>
  );
}

export function OtpInput({ value, onChange, length = 6, autoFocus = false }: OtpInputProps) {
  const ref = useRef<TextInput>(null);
  const chars = value.split('');

  return (
    <Pressable className="flex-row gap-2" onPress={() => ref.current?.focus()}>
      {/* TextInput ẩn nhận phím */}
      <TextInput
        ref={ref}
        value={value}
        onChangeText={t => onChange(t.replace(/\D/g, '').slice(0, length))}
        keyboardType="number-pad"
        maxLength={length}
        autoFocus={autoFocus}
        className="absolute opacity-0"
        style={{ width: 1, height: 1 }}
      />
      {Array.from({ length }).map((_, i) => (
        <OtpCell key={i} char={chars[i] ?? ''} active={i === value.length} />
      ))}
    </Pressable>
  );
}
