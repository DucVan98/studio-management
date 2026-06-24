import { Pressable, Text, ActivityIndicator } from 'react-native';
import type { PressableProps, GestureResponderEvent } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Icon } from './Icon';
import type { IconName } from './Icon';
import { useHaptics } from './useHaptics';

/**
 * Figma Button component
 * Variant=Primary   → bg-accent, text-on-accent, rounded-pill
 * Variant=Secondary → bg-surface border, text-accent, rounded-pill
 * Variant=Ghost     → transparent, text-accent
 * Variant=Danger    → nền hồng nhạt (#FFEEEE), chữ đỏ đậm (#C62626), viền đỏ nhạt (#E2B9B9)
 *
 * Animation: nhấn xuống co lại nhẹ (spring scale) + rung haptic light → cảm giác
 * "bấm được". Tôn trọng Reduce Motion (tắt scale).
 */

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: IconName;
  rightIcon?: IconName;
  /** Bật rung haptic khi nhấn. Mặc định true. */
  haptic?: boolean;
  /** Class bổ sung để override style mặc định khi cần */
  className?: string;
}

const VARIANT: Record<Variant, { container: string; text: string; iconColor: string }> = {
  primary:   { container: 'bg-accent',                              text: 'text-on-accent', iconColor: '#FFFFFF' },
  secondary: { container: 'bg-surface border border-border',        text: 'text-accent',    iconColor: 'var(--color-accent)' },
  ghost:     { container: 'bg-transparent',                         text: 'text-accent',    iconColor: 'var(--color-accent)' },
  // Figma Danger: nền hồng nhạt, chữ đỏ đậm, viền đỏ nhạt
  danger:    { container: 'bg-[#FFEEEE] border border-[#E2B9B9]',   text: 'text-[#C62626]', iconColor: '#C62626' },
};

const SIZE: Record<Size, { container: string; text: string }> = {
  // Figma dùng padding thay vì fix height: md = px 24 / py 16 (space/24, space/16)
  sm: { container: 'px-4 py-2 rounded-pill', text: 'text-body-sm font-medium' },
  md: { container: 'px-6 py-4 rounded-pill', text: 'text-button font-medium' },
  lg: { container: 'px-8 py-4 rounded-pill', text: 'text-body-lg font-medium' },
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const PRESS_SPRING = { damping: 15, stiffness: 320 } as const;

/** Nội dung trong nút: spinner/leftIcon + label + rightIcon. Tách ra để giảm
 *  complexity của Button (tránh lồng nhiều ternary trong JSX chính). */
function ButtonContent({
  label, loading, leftIcon, rightIcon, textClass, iconColor,
}: {
  label: string;
  loading: boolean;
  leftIcon?: IconName;
  rightIcon?: IconName;
  textClass: string;
  iconColor: string;
}) {
  return (
    <>
      {loading ? (
        <ActivityIndicator size="small" color={iconColor} />
      ) : leftIcon ? (
        <Icon name={leftIcon} size="sm" color={iconColor} />
      ) : null}
      <Text className={textClass}>{label}</Text>
      {rightIcon && !loading && (
        <Icon name={rightIcon} size="sm" color={iconColor} />
      )}
    </>
  );
}

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  haptic = true,
  disabled,
  className,
  onPressIn,
  onPressOut,
  ...rest
}: ButtonProps) {
  const v = VARIANT[variant];
  const s = SIZE[size];
  const isDisabled = disabled || loading;
  const haptics = useHaptics();

  const scale = useSharedValue(1);
  const reduced = useReducedMotion();
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePressIn = (e: GestureResponderEvent) => {
    if (!reduced) scale.set(withSpring(0.96, PRESS_SPRING));
    if (haptic) haptics.impact('light');
    onPressIn?.(e);
  };
  const handlePressOut = (e: GestureResponderEvent) => {
    scale.set(withSpring(1, PRESS_SPRING));
    onPressOut?.(e);
  };

  return (
    <AnimatedPressable
      className={[
        'flex-row items-center justify-center gap-2',
        v.container, s.container,
        fullWidth ? 'w-full' : 'self-start',
        isDisabled ? 'opacity-50' : '',
        className ?? '',
      ].join(' ')}
      style={animatedStyle}
      disabled={isDisabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...rest}
    >
      <ButtonContent
        label={label}
        loading={!!loading}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        textClass={`${s.text} ${v.text}`}
        iconColor={v.iconColor}
      />
    </AnimatedPressable>
  );
}
