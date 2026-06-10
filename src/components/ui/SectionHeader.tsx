import { View, Text, TouchableOpacity } from 'react-native';

/**
 * Figma SectionHeader — title trái + "Xem tất cả" phải
 */

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function SectionHeader({ title, actionLabel, onAction, className = '' }: SectionHeaderProps) {
  return (
    <View className={`flex-row items-center justify-between ${className}`}>
      <Text className="text-heading-md font-bold text-text">{title}</Text>
      {actionLabel && (
        <TouchableOpacity onPress={onAction} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text className="text-body-sm font-medium text-accent">{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
