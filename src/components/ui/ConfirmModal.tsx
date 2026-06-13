import { View, Text, Modal, Pressable } from 'react-native';
import { Icon } from './Icon';
import { Button } from './Button';
import type { IconName } from './Icon';


/**
 * ConfirmModal — overlay modal xác nhận ở trung tâm màn hình.
 * Tái sử dụng Button component cho nút action.
 *
 * Layout:
 *   - Scrim tối bán trong suốt
 *   - Card 320px, border-radius 24px
 *   - Icon circle 56×56px (optional)
 *   - Title SemiBold 17px + message Regular 14px
 *   - 1 hoặc 2 nút (confirmLabel bắt buộc, cancelLabel optional)
 */

export interface ConfirmModalProps {
  visible: boolean;
  /** Icon Feather để hiển thị trong circle */
  iconName?: IconName;
  /** Màu sắc icon circle theo loại */
  iconType?: 'error' | 'warning' | 'success' | 'info' | 'default';
  title: string;
  message?: string;
  confirmLabel: string;
  cancelLabel?: string;
  /** Variant cho nút confirm (mặc định primary) */
  confirmVariant?: 'primary' | 'danger';
  onConfirm: () => void;
  onCancel?: () => void;
}

// Màu icon circle theo type
const ICON_TYPE_STYLE: Record<
  NonNullable<ConfirmModalProps['iconType']>,
  { bg: string; iconColor: string }
> = {
  error:   { bg: '#FFE0E0', iconColor: '#C62626' },
  warning: { bg: '#FEF3C7', iconColor: '#D97706' },
  success: { bg: '#DCFCE7', iconColor: '#16A34A' },
  info:    { bg: '#DBEAFE', iconColor: '#2563EB' },
  default: { bg: '#F3F4F6', iconColor: '#6B7280' },
};

export function ConfirmModal({
  visible,
  iconName,
  iconType = 'default',
  title,
  message,
  confirmLabel,
  cancelLabel,
  confirmVariant = 'primary',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const iconStyle = ICON_TYPE_STYLE[iconType];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      {/* Scrim */}
      <Pressable
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
        onPress={onCancel}
      >
        {/* Card — Pressable trong để chặn tap đóng khi tap vào card */}
        <Pressable
          className="bg-surface w-80 rounded-3xl p-6 items-center gap-4"
          style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 24, elevation: 8 }}
          onPress={() => {/* chặn sự kiện bubble lên scrim */}}
        >
          {/* Icon circle 56×56 */}
          {iconName ? (
            <View
              style={{ backgroundColor: iconStyle.bg, width: 56, height: 56, borderRadius: 28 }}
              className="items-center justify-center"
            >
              <Icon name={iconName} size={24} color={iconStyle.iconColor} />
            </View>
          ) : null}

          {/* Texts */}
          <View className="items-center gap-2 w-full">
            <Text className="text-heading-md font-bold text-text text-center">{title}</Text>
            {message ? (
              <Text className="text-body-md text-text-muted text-center">{message}</Text>
            ) : null}
          </View>

          {/* Buttons */}
          <View className={`w-full gap-2 ${cancelLabel ? 'flex-col' : ''}`}>
            <Button
              label={confirmLabel}
              variant={confirmVariant}
              fullWidth
              onPress={onConfirm}
            />
            {cancelLabel ? (
              <Button
                label={cancelLabel}
                variant="ghost"
                fullWidth
                onPress={onCancel}
              />
            ) : null}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
