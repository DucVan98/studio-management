import { View, Text } from 'react-native';
import { Icon } from './Icon';
import type { IconName } from './Icon';

/**
 * Figma MilestoneRow component
 * bg-surface, radius-md (20), h=72, px=14
 *
 * State=Default → icon circle bg-surface-alt, days badge bg-surface-alt text-accent
 * State=Today   → icon circle bg-accent, days badge bg-accent text-on-accent
 *
 * @example
 * <MilestoneRow icon="heart" title="Ngày gặp nhau" date="14/02/2022" days="+856 ngày" />
 * <MilestoneRow icon="star" title="Kỷ niệm 1 năm" date="14/02/2023" days="Hôm nay" isToday />
 */

interface MilestoneRowProps {
  icon?: IconName;
  title: string;
  date?: string;
  days?: string;
  isToday?: boolean;
}

export function MilestoneRow({
  icon = 'heart',
  title,
  date,
  days,
  isToday = false,
}: MilestoneRowProps) {
  return (
    <View className="flex-row items-center gap-3 bg-surface rounded-md px-3.5 py-3.5 shadow-sm">
      {/* Icon circle */}
      <View
        className={[
          'w-11 h-11 rounded-full items-center justify-center',
          isToday ? 'bg-accent' : 'bg-surface-alt',
        ].join(' ')}
      >
        <Icon
          name={icon}
          size="md"
          color={isToday ? '#FFFFFF' : 'var(--color-accent)'}
        />
      </View>

      {/* Title + date */}
      <View className="flex-1 gap-0.5">
        <Text className="text-body-md font-semibold text-text">{title}</Text>
        {date && (
          <Text className="text-body-sm text-text-muted">{date}</Text>
        )}
      </View>

      {/* Days badge */}
      {days && (
        <View
          className={[
            'px-2.5 py-1 rounded-full',
            isToday ? 'bg-accent' : 'bg-surface-alt',
          ].join(' ')}
        >
          <Text
            className={[
              'text-body-sm font-semibold',
              isToday ? 'text-on-accent' : 'text-accent',
            ].join(' ')}
          >
            {days}
          </Text>
        </View>
      )}
    </View>
  );
}
