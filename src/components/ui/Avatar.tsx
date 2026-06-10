import { View, Text, Image } from 'react-native';

/**
 * Figma Avatar component
 * Size variants: xs=28 | sm=36 | md=48 | lg=64 | xl=80
 * Fallback: solid circle + initial letter
 */

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarColor = 'accent' | 'rose' | 'violet' | 'sky' | 'amber';

const SIZE_MAP: Record<AvatarSize, { dim: number; text: string }> = {
  xs: { dim: 28, text: 'text-body-sm' },
  sm: { dim: 36, text: 'text-body-md' },
  md: { dim: 48, text: 'text-heading-md' },
  lg: { dim: 64, text: 'text-heading-xl' },
  xl: { dim: 80, text: 'text-display-md' },
};

const COLOR_MAP: Record<AvatarColor, string> = {
  accent: 'bg-accent',
  rose:   'bg-[#f43f5e]',
  violet: 'bg-[#7c3aed]',
  sky:    'bg-[#0ea5e9]',
  amber:  'bg-[#f59e0b]',
};

interface AvatarProps {
  uri?: string | null;
  name?: string;
  size?: AvatarSize;
  color?: AvatarColor;
  className?: string;
}

export function Avatar({ uri, name, size = 'md', color = 'accent', className = '' }: AvatarProps) {
  const { dim, text } = SIZE_MAP[size];
  const initial = name ? name.trim().charAt(0).toUpperCase() : '?';
  const bgClass = COLOR_MAP[color];

  return (
    <View
      className={`rounded-full overflow-hidden items-center justify-center ${bgClass} ${className}`}
      style={{ width: dim, height: dim }}
    >
      {uri ? (
        <Image source={{ uri }} style={{ width: dim, height: dim }} resizeMode="cover" />
      ) : (
        <Text className={`${text} font-bold text-white`}>{initial}</Text>
      )}
    </View>
  );
}
