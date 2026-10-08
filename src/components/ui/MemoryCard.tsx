import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Icon } from './Icon';


/**
 * Figma MemoryCard component
 *
 * Type=Full    – 340×260, radius-lg (28), photo (190h) + info row (title + tag + date)
 * Type=Compact – 108×143, radius-md (20), photo (96h) + mini info (name + #tag)
 *
 * Tương tác: chạm đúp lên ảnh (type=full) để "thả tim" — trái tim bung ra + rung
 * haptic, gọi `onLike`. Chạm đơn vẫn mở chi tiết qua `onPress`.
 *
 * @example
 * <MemoryCard type="full" title="Chuyến đi Đà Lạt" tag="#dalat" date="12/06/2024" imageUri="..." onLike={like} />
 * <MemoryCard type="compact" title="Sapa" tag="#sapa" imageUri="..." />
 */

interface MemoryCardProps {
  type?: 'full' | 'compact';
  title: string;
  tag?: string;
  date?: string;
  imageUri?: string;
  onPress?: () => void;
  /** Gọi khi người dùng chạm đúp thả tim (chỉ type=full). */
  onLike?: () => void;
}

export function MemoryCard({
  type = 'full',
  title,
  tag,
  date,
  imageUri,
  onPress,
  onLike,
}: MemoryCardProps) {
  const haptics = 
  const reduced = useReducedMotion();
  const burst = useSharedValue(0);

  const burstStyle = useAnimatedStyle(() => ({
    opacity: burst.value,
    transform: [{ scale: interpolate(burst.value, [0, 1], [0.4, 1.3]) }],
  }));

  // Chạy trên JS thread: phản hồi haptic + báo lên cha.
  const fireLike = () => {
    haptics.impact('medium');
    onLike?.();
  };

  const playBurst = () => {
    if (!reduced) {
      burst.set(withSequence(
        withTiming(1, { duration: 180, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 420 }),
      ));
    }
  };

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      'worklet';
      runOnJS(fireLike)();
      runOnJS(playBurst)();
    });

  if (type === 'compact') {
    return (
      <TouchableOpacity
        className="bg-surface rounded-md overflow-hidden shadow-sm"
        style={{ width: 108 }}
        onPress={onPress}
        activeOpacity={0.85}
      >
        {/* Photo area */}
        <View className="bg-surface-alt" style={{ height: 96 }}>
          {imageUri && (
            <Image
              source={{ uri: imageUri }}
              className="w-full h-full"
              resizeMode="cover"
            />
          )}
        </View>
        {/* Info */}
        <View className="px-2 py-1.5 gap-0.5">
          <Text className="text-body-sm font-semibold text-text" numberOfLines={1}>
            {title}
          </Text>
          {tag && (
            <Text className="text-label font-regular text-text-muted" numberOfLines={1}>
              {tag}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      className="bg-surface rounded-lg overflow-hidden shadow-md"
      style={{ width: 340 }}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Photo area — chạm đúp để thả tim */}
      <GestureDetector gesture={doubleTap}>
        <View className="bg-surface-alt" style={{ height: 190 }}>
          {imageUri && (
            <Image
              source={{ uri: imageUri }}
              className="w-full h-full"
              resizeMode="cover"
            />
          )}
          {/* Trái tim bung ra khi thả tim */}
          <Animated.View
            className="absolute inset-0 items-center justify-center"
            style={burstStyle}
            pointerEvents="none"
          >
            <Icon name="heart" size={72} color="#FFFFFF" />
          </Animated.View>
        </View>
      </GestureDetector>
      {/* Info row */}
      <View className="px-3.5 py-3 gap-1">
        <Text className="text-body-md font-semibold text-text" numberOfLines={1}>
          {title}
        </Text>
        <View className="flex-row items-center gap-2">
          {tag && (
            <Text className="text-body-sm text-text-muted">{tag}</Text>
          )}
          {date && (
            <>
              <View className="w-1 h-1 rounded-full bg-border" />
              <View className="flex-row items-center gap-1">
                <Icon name="calendar" size="xs" color="var(--color-text-muted)" />
                <Text className="text-body-sm text-text-muted">{date}</Text>
              </View>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
