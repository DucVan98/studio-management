import { View, Text } from 'react-native';

/**
 * Figma Divider — horizontal separator với optional label ở giữa
 */

type Spacing = 'sm' | 'md' | 'lg';

const SPACING_MAP: Record<Spacing, string> = {
  sm: 'my-2',
  md: 'my-4',
  lg: 'my-6',
};

interface DividerProps {
  label?: string;
  spacing?: Spacing;
  className?: string;
}

export function Divider({ label, spacing = 'md', className = '' }: DividerProps) {
  if (label) {
    return (
      <View className={`flex-row items-center gap-3 ${SPACING_MAP[spacing]} ${className}`}>
        <View className="flex-1 h-px bg-border" />
        <Text className="text-body-sm text-text-muted font-medium">{label}</Text>
        <View className="flex-1 h-px bg-border" />
      </View>
    );
  }

  return <View className={`h-px bg-border ${SPACING_MAP[spacing]} ${className}`} />;
}
