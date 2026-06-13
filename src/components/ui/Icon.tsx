import Svg from 'react-native-svg';
import { useUnstableNativeVariable } from 'nativewind';

import { ICON_PATHS } from './iconPaths';

/**
 * Figma Icon component — render SVG thuần qua react-native-svg.
 * Path data trong iconPaths.tsx (bộ line-icon trùng icon set Figma).
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
  | 'chevron-left' | 'check' | 'x' | 'settings' | 'search'
  | 'alert-circle' | 'alert-triangle' | 'check-circle' | 'info';

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

// react-native-svg không hiểu chuỗi 'var(--x)' — resolve qua NativeWind runtime.
// Hook phải gọi vô điều kiện nên luôn subscribe (dùng tên rỗng khi không phải var).
function useResolvedColor(color: string): string {
  const varName = /^var\((--[\w-]+)\)$/.exec(color)?.[1];
  const varValue = useUnstableNativeVariable(varName ?? '--__none__');
  if (!varName) return color;
  return typeof varValue === 'string' ? varValue : '#000000';
}

export function Icon({ name, size = 'md', color = 'currentColor' }: IconProps) {
  const resolvedSize = typeof size === 'string' ? SIZE_MAP[size] : size;
  const resolvedColor = useResolvedColor(color);

  return (
    <Svg
      width={resolvedSize}
      height={resolvedSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke={resolvedColor}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {ICON_PATHS[name]}
    </Svg>
  );
}
