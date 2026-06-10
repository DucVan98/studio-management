import { View } from 'react-native';

/**
 * Figma ProgressBar — thin track với filled portion bg-accent
 */

type BarColor = 'accent' | 'success' | 'warning' | 'error';

const COLOR_MAP: Record<BarColor, string> = {
  accent:  'bg-accent',
  success: 'bg-success',
  warning: 'bg-warning',
  error:   'bg-error',
};

interface ProgressBarProps {
  /** 0–1 */
  value: number;
  color?: BarColor;
  /** Height in px, default 6 */
  height?: number;
  className?: string;
}

export function ProgressBar({ value, color = 'accent', height = 6, className = '' }: ProgressBarProps) {
  const clamped = Math.min(1, Math.max(0, value));

  return (
    <View className={`w-full bg-surface-alt rounded-pill overflow-hidden ${className}`} style={{ height }}>
      <View className={`h-full rounded-pill ${COLOR_MAP[color]}`} style={{ width: `${clamped * 100}%` }} />
    </View>
  );
}
