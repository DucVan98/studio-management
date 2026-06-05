import { TouchableOpacity, Text, View } from 'react-native';
import { Icon } from './Icon';
import type { IconName } from './Icon';

/**
 * Figma GiftCard component
 * bg-surface, radius-md (20), 108×110
 * icon circle 36×36 surface-alt bg → tên quà → giá
 *
 * @example
 * <GiftCard icon="gift" name="Hoa hồng" price="150.000đ" onPress={...} />
 */

interface GiftCardProps {
  icon?: IconName;
  name: string;
  price?: string;
  onPress?: () => void;
}

export function GiftCard({ icon = 'gift', name, price, onPress }: GiftCardProps) {
  return (
    <TouchableOpacity
      className="bg-surface rounded-md p-3.5 w-28 gap-2 shadow-sm"
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View className="w-9 h-9 rounded-pill bg-surface-alt items-center justify-center">
        <Icon name={icon} size="sm" color="var(--color-accent)" />
      </View>
      <Text className="text-body-sm font-semibold text-text" numberOfLines={1}>
        {name}
      </Text>
      {price && (
        <Text className="text-label font-regular text-text-muted" numberOfLines={1}>
          {price}
        </Text>
      )}
    </TouchableOpacity>
  );
}
