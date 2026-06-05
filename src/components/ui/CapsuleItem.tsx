import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from './Icon';
import type { IconName } from './Icon';

/**
 * Figma CapsuleItem component
 * bg-surface, radius-md (20), h=76
 *
 * State=Sealed   → icon circle bg-surface-alt, progress bar bg-surface-alt, days badge muted
 * State=Unlocked → icon circle bg-accent, no progress bar, days badge bg-accent
 *
 * @example
 * <CapsuleItem icon="lock" title="Capsule tháng 6" status="Sealed" daysLeft="45 ngày" progress={0.3} />
 * <CapsuleItem icon="star" title="Capsule Tết" status="Đã mở" isUnlocked />
 */

interface CapsuleItemProps {
  icon?: IconName;
  title: string;
  status?: string;
  daysLeft?: string;
  /** 0–1, chỉ hiển thị khi isUnlocked=false */
  progress?: number;
  isUnlocked?: boolean;
  onPress?: () => void;
}

export function CapsuleItem({
  icon = 'lock',
  title,
  status,
  daysLeft,
  progress = 0,
  isUnlocked = false,
  onPress,
}: CapsuleItemProps) {
  return (
    <TouchableOpacity
      className="flex-row items-center gap-3 bg-surface rounded-md px-3.5 py-3.5 shadow-sm"
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Icon circle */}
      <View
        className={[
          'w-10 h-10 rounded-full items-center justify-center',
          isUnlocked ? 'bg-accent' : 'bg-surface-alt',
        ].join(' ')}
      >
        <Icon
          name={isUnlocked ? 'star' : icon}
          size="md"
          color={isUnlocked ? '#FFFFFF' : 'var(--color-accent)'}
        />
      </View>

      {/* Title + status + progress */}
      <View className="flex-1 gap-1">
        <Text className="text-body-md font-semibold text-text" numberOfLines={1}>
          {title}
        </Text>
        {status && (
          <Text className="text-body-sm text-text-muted">{status}</Text>
        )}
        {!isUnlocked && (
          <View className="h-1.5 bg-surface-alt rounded-full overflow-hidden mt-0.5" style={{ width: 100 }}>
            <View
              className="h-full bg-accent rounded-full"
              style={{ width: `${Math.min(progress * 100, 100)}%` }}
            />
          </View>
        )}
      </View>

      {/* Days badge */}
      {daysLeft && (
        <View
          className={[
            'px-2.5 py-1 rounded-full',
            isUnlocked ? 'bg-accent' : 'bg-surface-alt',
          ].join(' ')}
        >
          <Text
            className={[
              'text-label font-semibold',
              isUnlocked ? 'text-on-accent' : 'text-text-muted',
            ].join(' ')}
          >
            {daysLeft}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
