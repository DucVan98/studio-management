import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from './Icon';
import { Button } from './Button';
import type { IconName } from './Icon';

/**
 * Alert — toast notification component
 * Thiết kế theo Impeccable: nền tinted, không dùng side-stripe.
 *
 * Types: error | warning | success | info
 * Có thể có action button (tái sử dụng Button component) và nút close.
 */

export type AlertType = 'error' | 'warning' | 'success' | 'info';

export interface AlertProps {
  type: AlertType;
  title: string;
  message?: string;
  /** Label nút action (không truyền = ẩn nút) */
  actionLabel?: string;
  onAction?: () => void;
  onClose?: () => void;
}

// Mỗi type có: bg nền, màu icon bubble, màu icon stroke, màu text action, màu viền
const TYPE_STYLE: Record<
  AlertType,
  { bg: string; bubble: string; iconColor: string; iconName: IconName; actionColor: string; border: string }
> = {
  error: {
    bg: '#FFF0F0',
    bubble: '#FFE0E0',
    iconColor: '#C62626',
    iconName: 'alert-circle',
    actionColor: '#C62626',
    border: '#F0C8C8',
  },
  warning: {
    bg: '#FFFBEB',
    bubble: '#FEF3C7',
    iconColor: '#D97706',
    iconName: 'alert-triangle',
    actionColor: '#D97706',
    border: '#F5D9A0',
  },
  success: {
    bg: '#F0FDF4',
    bubble: '#DCFCE7',
    iconColor: '#16A34A',
    iconName: 'check-circle',
    actionColor: '#16A34A',
    border: '#BBF7D0',
  },
  info: {
    bg: '#EFF6FF',
    bubble: '#DBEAFE',
    iconColor: '#2563EB',
    iconName: 'info',
    actionColor: '#2563EB',
    border: '#BFDBFE',
  },
};

export function Alert({ type, title, message, actionLabel, onAction, onClose }: AlertProps) {
  const s = TYPE_STYLE[type];

  return (
    <View
      style={{ backgroundColor: s.bg, borderColor: s.border, borderWidth: 1, borderRadius: 14, padding: 14 }}
      // Khi chỉ có title (không có message/action): căn giữa dọc icon + text + close
      // Khi có message/action: items-start để icon ở đầu block
      className={`flex-row gap-3 ${message || actionLabel ? 'items-start' : 'items-center'}`}
    >
      {/* Icon bubble 28×28 */}
      <View
        style={{ backgroundColor: s.bubble, width: 28, height: 28, borderRadius: 8 }}
        className="items-center justify-center shrink-0"
      >
        <Icon name={s.iconName} size={16} color={s.iconColor} />
      </View>

      {/* Nội dung */}
      <View className="flex-1 gap-1">
        <Text className="text-body-md font-medium text-text">{title}</Text>
        {message ? (
          <Text className="text-body-sm text-text-muted">{message}</Text>
        ) : null}
        {actionLabel ? (
          <View className="mt-2">
            <Button
              label={actionLabel}
              variant="ghost"
              size="sm"
              onPress={onAction}
            />
          </View>
        ) : null}
      </View>

      {/* Nút close */}
      {onClose ? (
        <TouchableOpacity
          onPress={onClose}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          className="shrink-0"
        >
          <Icon name="x" size={16} color="#9CA3AF" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
