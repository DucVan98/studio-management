import { DIContainer } from '../../di/DIContainer';
import type { IHaptics } from '../../services/haptics/IHaptics';

/**
 * Hook tiện ích cho component lấy adapter haptics (singleton từ DIContainer).
 * UI chỉ phụ thuộc interface IHaptics, không biết tới expo-haptics.
 *
 * @example
 * const haptics = useHaptics();
 * haptics.impact('light');   // khi nhấn nút
 * haptics.notify('success'); // khi kết nối thành công
 */
export function useHaptics(): IHaptics {
  return DIContainer.getInstance().getHaptics();
}
