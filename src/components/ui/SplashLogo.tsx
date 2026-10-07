import { useEffect } from 'react';
import { View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useThemeColors } from '../../tokens/useThemeColors';

/**
 * Splash khởi động trong app — trái tim bung ra (spring scale + xoay nhẹ),
 * wordmark "Studio Management" mờ dần hiện lên. Gọi `onDone` sau khi xong (để chuyển màn).
 *
 * @example
 * <View className="flex-1 items-center justify-center bg-bg">
 *   <SplashLogo onDone={() => setReady(true)} />
 * </View>
 */

const HEART_PATH =
  'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z';

interface SplashLogoProps {
  /** Đường kính trái tim (px). Mặc định 88. */
  size?: number;
  /** Chữ hiển thị dưới tim. Mặc định 'studio-management'. */
  wordmark?: string;
  /** Gọi khi animation hoàn tất. */
  onDone?: () => void;
}

export function SplashLogo({ size = 88, wordmark = 'studio-management', onDone }: SplashLogoProps) {
  const colors = useThemeColors();
  const accent = colors['--color-accent'];
  const reduced = useReducedMotion();

  const scale = useSharedValue(reduced ? 1 : 0);
  const rotate = useSharedValue(reduced ? 0 : -25);
  const textP = useSharedValue(reduced ? 1 : 0);

  useEffect(() => {
    if (reduced) {
      onDone?.();
      return;
    }
    scale.value = withSpring(1, { damping: 9, stiffness: 90 });
    rotate.value = withSpring(0, { damping: 10, stiffness: 90 });
    textP.value = withDelay(
      700,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) }, finished => {
        if (finished && onDone) runOnJS(onDone)();
      }),
    );
  }, [reduced, onDone, scale, rotate, textP]);

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
  }));
  const textStyle = useAnimatedStyle(() => ({
    opacity: textP.value,
    transform: [{ translateY: interpolate(textP.value, [0, 1], [14, 0]) }],
  }));

  return (
    <View className="items-center justify-center gap-4">
      <Animated.View style={heartStyle}>
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d={HEART_PATH} fill={accent} />
        </Svg>
      </Animated.View>
      <Animated.View style={textStyle}>
        <Text className="text-display-md font-bold text-accent italic">{wordmark}</Text>
      </Animated.View>
    </View>
  );
}
