import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import type { TouchableOpacityProps } from 'react-native';
import { Icon } from './Icon';
import type { IconName } from './Icon';

/**
 * Figma Button component
 * Variant=Primary  → bg-accent, text-on-accent, rounded-pill
 * Variant=Secondary → bg-surface border, text-accent, rounded-pill
 */

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: IconName;
  rightIcon?: IconName;
  /** Class bổ sung để override style mặc định khi cần */
  className?: string;
}

const VARIANT: Record<Variant, { container: string; text: string; iconColor: string }> = {
  primary:   { container: 'bg-accent',                      text: 'text-on-accent', iconColor: '#FFFFFF' },
  secondary: { container: 'bg-surface border border-border', text: 'text-accent',    iconColor: 'var(--color-accent)' },
  ghost:     { container: 'bg-transparent',                  text: 'text-accent',    iconColor: 'var(--color-accent)' },
  danger:    { container: 'bg-error',                        text: 'text-white',     iconColor: '#FFFFFF' },
};

const SIZE: Record<Size, { container: string; text: string }> = {
  // Figma dùng padding thay vì fix height: md = px 24 / py 16 (space/24, space/16)
  sm: { container: 'px-4 py-2 rounded-pill', text: 'text-body-sm font-medium' },
  md: { container: 'px-6 py-4 rounded-pill', text: 'text-button font-medium' },
  lg: { container: 'px-8 py-4 rounded-pill', text: 'text-body-lg font-medium' },
};

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  className,
  ...rest
}: ButtonProps) {
  const v = VARIANT[variant];
  const s = SIZE[size];
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      className={[
        'flex-row items-center justify-center gap-2',
        v.container, s.container,
        fullWidth ? 'w-full' : 'self-start',
        isDisabled ? 'opacity-50' : '',
        className ?? '',
      ].join(' ')}
      disabled={isDisabled}
      activeOpacity={0.8}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color={v.iconColor} />
      ) : leftIcon ? (
        <Icon name={leftIcon} size="sm" color={v.iconColor} />
      ) : null}
      <Text className={`${s.text} ${v.text}`}>{label}</Text>
      {rightIcon && !loading && (
        <Icon name={rightIcon} size="sm" color={v.iconColor} />
      )}
    </TouchableOpacity>
  );
}
