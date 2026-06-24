import { useEffect } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useThemeColors } from '../../tokens/useThemeColors';
import { useHaptics } from './useHaptics';

/**
 * Công tắc bật/tắt — knob trượt với spring (hơi nảy), nền đổi màu mượt + rung
 * haptic selection. Dùng cho mọi toggle trong Cài đặt.
 *
 * @example
 * const [on, setOn] = useState(true);
 * <AnimatedToggle value={on} onValueChange={setOn} />
 */

const TRACK_W = 52;
const TRACK_H = 30;
const KNOB = 24;
const PAD = 3;
const TRAVEL = TRACK_W - KNOB - PAD * 2;
const SPRING = { damping: 15, stiffness: 220 } as const;

interface AnimatedToggleProps {
  value: boolean;
  onValueChange?: (next: boolean) => void;
  disabled?: boolean;
}

export function AnimatedToggle({ value, onValueChange, disabled = false }: AnimatedToggleProps) {
  const colors = useThemeColors();
  const haptics = useHaptics();
  const reduced = useReducedMotion();
  const p = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    p.value = reduced ? (value ? 1 : 0) : withSpring(value ? 1 : 0, SPRING);
  }, [value, reduced, p]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(p.value, [0, 1], [colors['--color-surface-alt'], colors['--color-accent']]),
  }));
  const knobStyle = useAnimatedStyle(() => ({ transform: [{ translateX: p.value * TRAVEL }] }));

  return (
    <Pressable
      disabled={disabled}
      hitSlop={8}
      onPress={() => {
        haptics.selection();
        onValueChange?.(!value);
      }}
    >
      <Animated.View
        style={[
          { width: TRACK_W, height: TRACK_H, borderRadius: TRACK_H / 2, padding: PAD, opacity: disabled ? 0.5 : 1 },
          trackStyle,
        ]}
      >
        <Animated.View
          className="shadow-sm"
          style={[{ width: KNOB, height: KNOB, borderRadius: KNOB / 2, backgroundColor: '#FFFFFF' }, knobStyle]}
        />
      </Animated.View>
    </Pressable>
  );
}
