import { View, Text } from 'react-native';
import { Icon } from './Icon';
import { Button } from './Button';
import type { IconName } from './Icon';

/**
 * Figma EmptyState — icon circle + title + subtitle + optional CTA
 * Dùng khi danh sách trống: memories, capsules, milestones...
 */

interface EmptyStateProps {
  icon?: IconName;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon = 'star',
  title,
  subtitle,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <View className={`items-center justify-center py-12 px-8 ${className}`}>
      <View className="w-20 h-20 rounded-full bg-surface-alt items-center justify-center mb-5">
        <Icon name={icon} size="xl" color="var(--color-accent)" />
      </View>
      <Text className="text-heading-md font-bold text-text text-center mb-2">{title}</Text>
      {subtitle && (
        <Text className="text-body-md text-text-muted text-center leading-6">{subtitle}</Text>
      )}
      {actionLabel && onAction && (
        <View className="mt-6">
          <Button label={actionLabel} onPress={onAction} size="md" />
        </View>
      )}
    </View>
  );
}
