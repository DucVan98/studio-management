import { Feather } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

/**
 * Figma Icon component – wraps Feather icons.
 * Maps tên icon từ Figma sang Feather icon names.
 *
 * Sizes (Figma primitives):
 *   xs=14 | sm=18 | md=20 | lg=24 | xl=26
 */

export type IconName =
  | 'home' | 'image' | 'award' | 'compass' | 'user'
  | 'plus' | 'bell' | 'sliders' | 'cloud' | 'heart'
  | 'star' | 'gift' | 'camera' | 'calendar' | 'mail'
  | 'zap' | 'send' | 'copy' | 'chevron-right' | 'activity'
  | 'map-pin' | 'sun' | 'edit-2' | 'lock' | 'trash-2'
  | 'chevron-left' | 'check' | 'x' | 'settings' | 'search';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const SIZE_MAP: Record<IconSize, number> = {
  xs: 14,
  sm: 18,
  md: 20,
  lg: 24,
  xl: 26,
};

interface IconProps {
  name: IconName;
  size?: IconSize | number;
  color?: string;
}

export function Icon({ name, size = 'md', color = 'currentColor' }: IconProps) {
  const resolvedSize = typeof size === 'string' ? SIZE_MAP[size] : size;

  return (
    <Feather
      name={name as ComponentProps<typeof Feather>['name']}
      size={resolvedSize}
      color={color}
    />
  );
}
