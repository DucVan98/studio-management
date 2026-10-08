import { themeColors } from './themes';

/**
 * Trả về bảng màu hex của theme hiện tại.
 * Dùng khi cần truyền màu vào prop không hỗ trợ NativeWind className.
 */
export function useThemeColors(): Record<string, string> {
  return themeColors['rose-romantic'];
}
