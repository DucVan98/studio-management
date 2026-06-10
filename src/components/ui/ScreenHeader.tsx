import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from './Icon';
import type { IconName } from './Icon';

/**
 * Figma ScreenHeader — [back] [title] [right action]
 * Dùng trong screens cần navigation header (không phải tab root)
 */

interface ScreenHeaderProps {
  title?: string;
  onBack?: () => void;
  rightIcon?: IconName;
  onRightPress?: () => void;
  /** Không có nền, icon trắng — dùng khi overlay trên ảnh/gradient */
  transparent?: boolean;
  safeArea?: boolean;
}

export function ScreenHeader({
  title,
  onBack,
  rightIcon,
  onRightPress,
  transparent = false,
  safeArea = true,
}: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const iconColor = transparent ? '#FFFFFF' : 'var(--color-text)';
  const bgClass   = transparent ? '' : 'bg-surface border-b border-border';

  return (
    <View
      className={`flex-row items-center px-4 ${bgClass}`}
      style={{
        paddingTop: safeArea ? insets.top + 8 : 8,
        paddingBottom: 12,
        height: (safeArea ? insets.top : 0) + 52,
      }}
    >
      <View className="w-10">
        {onBack && (
          <TouchableOpacity onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} activeOpacity={0.7}>
            <Icon name="chevron-left" size="lg" color={iconColor} />
          </TouchableOpacity>
        )}
      </View>

      <View className="flex-1 items-center">
        {title ? (
          <Text className={`text-heading-md font-bold ${transparent ? 'text-white' : 'text-text'}`} numberOfLines={1}>
            {title}
          </Text>
        ) : null}
      </View>

      <View className="w-10 items-end">
        {rightIcon && (
          <TouchableOpacity onPress={onRightPress} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} activeOpacity={0.7}>
            <Icon name={rightIcon} size="lg" color={iconColor} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
