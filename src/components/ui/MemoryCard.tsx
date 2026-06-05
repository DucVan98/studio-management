import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Icon } from './Icon';

/**
 * Figma MemoryCard component
 *
 * Type=Full    – 340×260, radius-lg (28), photo (190h) + info row (title + tag + date)
 * Type=Compact – 108×143, radius-md (20), photo (96h) + mini info (name + #tag)
 *
 * @example
 * <MemoryCard type="full" title="Chuyến đi Đà Lạt" tag="#dalat" date="12/06/2024" imageUri="..." />
 * <MemoryCard type="compact" title="Sapa" tag="#sapa" imageUri="..." />
 */

interface MemoryCardProps {
  type?: 'full' | 'compact';
  title: string;
  tag?: string;
  date?: string;
  imageUri?: string;
  onPress?: () => void;
}

export function MemoryCard({
  type = 'full',
  title,
  tag,
  date,
  imageUri,
  onPress,
}: MemoryCardProps) {
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
      {/* Photo area */}
      <View className="bg-surface-alt" style={{ height: 190 }}>
        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            className="w-full h-full"
            resizeMode="cover"
          />
        )}
      </View>
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
