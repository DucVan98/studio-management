import { TouchableOpacity, Text } from 'react-native';
import { Icon } from './Icon';
import type { IconName } from './Icon';

/**
 * Figma ListRow component
 * bg-surface, h=52, px=16 py=16, gap=12
 * left icon-md → label → right chevron
 *
 * @example
 * <ListRow icon="bell" label="Thông báo" onPress={...} />
 * <ListRow icon="settings" label="Cài đặt" onPress={...} showChevron={false} />
 */

interface ListRowProps {
  label: string;
  icon?: IconName;
  rightIcon?: IconName;
  showChevron?: boolean;
  onPress?: () => void;
}

export function ListRow({
  label,
  icon,
  rightIcon,
  showChevron = true,
  onPress,
}: ListRowProps) {
  return (
    <TouchableOpacity
      className="flex-row items-center gap-3 bg-surface px-4 py-4"
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon && (
        <Icon name={icon} size="md" color="var(--color-text)" />
      )}
      <Text className="flex-1 text-body-md font-medium text-text">
        {label}
      </Text>
      {rightIcon ? (
        <Icon name={rightIcon} size="sm" color="var(--color-text-muted)" />
      ) : showChevron ? (
        <Icon name="chevron-right" size="sm" color="var(--color-text-muted)" />
      ) : null}
    </TouchableOpacity>
  );
}
