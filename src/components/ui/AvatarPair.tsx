import { useEffect } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import { Avatar } from './Avatar';
import type { AvatarSize, AvatarColor } from './Avatar';


/**
 * Figma AvatarPair — hai avatar chồng lên nhau (left trước right). Offset = 40%.
 *
 * Khi `animateJoin` = true (vd màn "Đã kết nối"): hai avatar trượt từ ngoài vào
 * gần nhau (spring) rồi một trái tim nhỏ bật ra ở giữa + rung haptic success.
 */

const HEART_PATH =
  'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z';

interface AvatarInfo {
  uri?: string | null;
  name?: string;
  color?: AvatarColor;
}

interface AvatarPairProps {
  left: AvatarInfo;
  right: AvatarInfo;
  size?: AvatarSize;
  /** Bật animation kết nối khi mount. Mặc định false (hiển thị tĩnh). */
  animateJoin?: boolean;
}

const SIZE_DIM: Record<AvatarSize, number> = {
  xs: 28, sm: 36, md: 48, lg: 64, xl: 80,
};

const JOIN_SPRING = { damping: 13, stiffness: 160 } as const;

export function AvatarPair({ left, right, size = 'md', animateJoin = false }: AvatarPairProps) {
  const dim = SIZE_DIM[size];
  const overlap = Math.round(dim * 0.4);
  const reduced = useReducedMotion();
  const haptics = 

  // 1 = về đúng vị trí; 0 = tách ra xa (bắt đầu). Tĩnh thì luôn 1.
  const join = useSharedValue(animateJoin && !reduced ? 0 : 1);
  const heart = useSharedValue(animateJoin && !reduced ? 0 : 1);

  useEffect(() => {
    if (!animateJoin || reduced) return;
    join.value = withSpring(1, JOIN_SPRING);
    heart.value = withDelay(280, withSpring(1, { damping: 8, stiffness: 180 }));
    const id = setTimeout(() => haptics.notify('success'), 300);
    return () => clearTimeout(id);
  }, [animateJoin, reduced, join, heart, haptics]);

  // Tách ra: left lệch trái, right lệch phải thêm 60% dim.
  const spread = dim * 0.6;
  const leftStyle = useAnimatedStyle(() => ({ transform: [{ translateX: (join.value - 1) * spread }] }));
  const rightStyle = useAnimatedStyle(() => ({ transform: [{ translateX: (1 - join.value) * spread }] }));
  const heartStyle = useAnimatedStyle(() => ({ opacity: heart.value, transform: [{ scale: heart.value }] }));

  const heartSize = Math.round(dim * 0.5);

  return (
    <View style={{ width: dim * 2 - overlap, height: dim }}>
      {/* Right avatar — behind */}
      <Animated.View style={[{ position: 'absolute', right: 0 }, rightStyle]}>
        <Avatar uri={right.uri} name={right.name} size={size} color={right.color ?? 'rose'} className="border-2 border-surface" />
      </Animated.View>
      {/* Left avatar — in front */}
      <Animated.View style={[{ position: 'absolute', left: 0, zIndex: 1 }, leftStyle]}>
        <Avatar uri={left.uri} name={left.name} size={size} color={left.color ?? 'accent'} className="border-2 border-surface" />
      </Animated.View>
      {/* Trái tim bật ra ở giữa khi kết nối */}
      {animateJoin && (
        <Animated.View
          className="absolute items-center justify-center"
          style={[{ left: 0, right: 0, top: dim / 2 - heartSize / 2, zIndex: 2 }, heartStyle]}
          pointerEvents="none"
        >
          <Svg width={heartSize} height={heartSize} viewBox="0 0 24 24">
            <Path d={HEART_PATH} fill="#FFFFFF" />
          </Svg>
        </Animated.View>
      )}
    </View>
  );
}
