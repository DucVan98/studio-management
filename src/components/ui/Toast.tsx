import { useEffect } from 'react';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { Alert } from './Alert';
import type { AlertType } from './Alert';


/**
 * Toast nổi ở đỉnh màn hình — TÁI SỬ DỤNG giao diện `Alert` (nền tinted, bubble
 * icon, viền) để đồng bộ với hệ thống thông báo của app. Trượt xuống + fade nhẹ
 * khi hiện, trượt lên khi ẩn (không nảy), tự ẩn sau `duration` + rung haptic.
 *
 * Là component có kiểm soát: cha giữ state `visible` và xử lý `onHide`.
 *
 * @example
 * <Toast visible={saved} type="success" title="Đã lưu kỷ niệm 💕" onHide={() => setSaved(false)} />
 */

export type ToastType = AlertType;

interface ToastProps {
  visible: boolean;
  /** Dòng chính (in đậm). */
  title: string;
  /** Dòng phụ (tuỳ chọn). */
  message?: string;
  type?: ToastType;
  /** Thời gian hiển thị (ms). Mặc định 2600. */
  duration?: number;
  onHide?: () => void;
}

export function Toast({ visible, title, message, type = 'success', duration = 2600, onHide }: ToastProps) {
  const haptics = 

  useEffect(() => {
    if (!visible) return;
    // Rung phản hồi theo loại.
    if (type === 'error') haptics.notify('error');
    else if (type === 'warning') haptics.notify('warning');
    else if (type === 'success') haptics.notify('success');
    else haptics.impact('light');

    const id = setTimeout(() => onHide?.(), duration);
    return () => clearTimeout(id);
  }, [visible, type, duration, onHide, haptics]);

  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeInDown.duration(240)}
      exiting={FadeOutUp.duration(180)}
      pointerEvents="box-none"
      className="absolute top-3 left-4 right-4"
    >
      <Alert type={type} title={title} message={message} onClose={onHide} />
    </Animated.View>
  );
}
