import { TouchableOpacity, Text } from 'react-native';

/**
 * Figma Pill component
 * Variant=Active  → bg-accent, text-on-accent
 * Variant=Default → bg-surface, text-text
 *
 * @example
 * <Pill label="Tất cả" active />
 * <Pill label="Ký ức" onPress={() => setTab('memories')} />
 */

interface PillProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
}

export function Pill({ label, active = false, onPress }: PillProps) {
  return (
    <TouchableOpacity
      className={[
        'h-8 px-4 rounded-pill items-center justify-center',
        active ? 'bg-accent' : 'bg-surface',
      ].join(' ')}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text
        className={[
          'text-body-sm font-medium',
          active ? 'text-on-accent' : 'text-text',
        ].join(' ')}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
