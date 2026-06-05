import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from './Icon';
import type { IconName } from './Icon';

/**
 * Figma NotificationItem component
 * State=Unread → bg-surface-alt, icon circle bg-accent
 * State=Read   → bg-surface,     icon circle bg-surface-alt
 *
 * @example
 * <NotificationItem icon="heart" message="Bạn có 1 kỷ niệm mới" time="2 phút trước" isUnread />
 * <NotificationItem icon="bell"  message="Nhắc nhở: Ngày kỷ niệm" time="Hôm qua" />
 */

interface NotificationItemProps {
  icon?: IconName;
  message: string;
  time?: string;
  isUnread?: boolean;
  onPress?: () => void;
}

export function NotificationItem({
  icon = 'bell',
  message,
  time,
  isUnread = false,
  onPress,
}: NotificationItemProps) {
  return (
    <TouchableOpacity
      className={[
        'flex-row items-center gap-3 rounded-md px-3.5 py-3.5',
        isUnread ? 'bg-surface-alt' : 'bg-surface',
      ].join(' ')}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Icon circle */}
      <View
        className={[
          'w-10 h-10 rounded-full items-center justify-center',
          isUnread ? 'bg-accent' : 'bg-surface-alt',
        ].join(' ')}
      >
        <Icon
          name={icon}
          size="md"
          color={isUnread ? '#FFFFFF' : 'var(--color-accent)'}
        />
      </View>

      {/* Content */}
      <View className="flex-1 gap-1">
        <Text className="text-body-sm font-medium text-text" numberOfLines={2}>
          {message}
        </Text>
        {time && (
          <Text className="text-body-sm text-text-muted">{time}</Text>
        )}
      </View>

      {/* Unread dot */}
      {isUnread && (
        <View className="w-2 h-2 rounded-full bg-accent" />
      )}
    </TouchableOpacity>
  );
}
