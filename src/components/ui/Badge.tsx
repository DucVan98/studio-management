import { View, Text } from 'react-native';
import { Icon } from './Icon';
import type { IconName } from './Icon';

/**
 * Figma Badge component
 * bg-accent, pill shape, icon-xs + label text SemiBold
 *
 * @example
 * <Badge label="Hôm nay" icon="heart" />
 * <Badge label="3 kỷ niệm" icon="image" />
 */

interface BadgeProps {
  label: string;
  icon?: IconName;
}

export function Badge({ label, icon }: BadgeProps) {
  return (
    <View className="flex-row items-center gap-2 bg-accent rounded-pill px-4 py-2 self-start">
      {icon && <Icon name={icon} size="xs" color="#FFFFFF" />}
      <Text className="text-body-sm font-semibold text-on-accent">{label}</Text>
    </View>
  );
}
