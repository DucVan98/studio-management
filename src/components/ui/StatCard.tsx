import { View, Text } from 'react-native';

/**
 * Figma StatCard component
 * bg-surface, radius-md (20), 110×80, centered
 * value: text-2xl Bold accent
 * label: text-label Medium text-muted
 *
 * @example
 * <StatCard value="365" label="Ngày bên nhau" />
 * <StatCard value="12" label="Ký ức" />
 */

interface StatCardProps {
  value: string | number;
  label: string;
}

export function StatCard({ value, label }: StatCardProps) {
  return (
    <View className="bg-surface rounded-md items-center justify-center py-4 w-28 shadow-sm">
      <Text className="text-2xl font-bold text-accent leading-8">
        {String(value)}
      </Text>
      <Text className="text-label font-medium text-text-muted mt-1">
        {label}
      </Text>
    </View>
  );
}
