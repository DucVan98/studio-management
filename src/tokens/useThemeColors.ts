import { useValue } from '@legendapp/state/react';
import { appStore$ } from '../stores/app.store';
import { themeColors } from './themes';

/**
 * Trả về bảng màu hex của theme hiện tại.
 *
 * Dùng khi cần truyền màu vào prop KHÔNG đi qua NativeWind className
 * (vd: `color` của @expo/vector-icons, `shadowColor`, gradient...) —
 * những chỗ này không hiểu chuỗi 'var(--color-*)'.
 *
 * Lưu ý: KHÔNG export qua tokens/index.ts để tránh circular import
 * (stores đang import từ '@/tokens').
 */
export function useThemeColors(): Record<string, string> {
  const theme = useValue(appStore$.theme);
  return themeColors[theme];
}
