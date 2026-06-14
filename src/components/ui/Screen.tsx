import type { ReactNode } from 'react';
import { View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Edge } from 'react-native-safe-area-context';

interface ScreenProps {
  children: ReactNode;
  /** Cạnh cần chừa safe-area inset. Mặc định chỉ chừa cạnh trên. */
  edges?: Edge[];
  className?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Khung màn hình chuẩn — thay cho `SafeAreaView` của react-native-safe-area-context.
 *
 * Lý do tự viết: component `SafeAreaView` tự đo frame bằng `onLayout` để quyết định
 * padding mỗi cạnh, nên frame đầu padding=0 → nội dung đè lên status bar rồi nhảy
 * xuống (nháy). Ở đây đọc inset đồng bộ qua `useSafeAreaInsets()` (context đã sẵn
 * sàng nhờ InsetsReadyGate ở App) → paint đúng vị trí ngay frame đầu, không nháy.
 */
export function Screen({ children, edges = ['top'], className, style }: ScreenProps) {
  const insets = useSafeAreaInsets();
  const padding: ViewStyle = {
    paddingTop: edges.includes('top') ? insets.top : 0,
    paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
    paddingLeft: edges.includes('left') ? insets.left : 0,
    paddingRight: edges.includes('right') ? insets.right : 0,
  };
  return (
    <View className={`flex-1 bg-bg ${className ?? ''}`} style={[padding, style]}>
      {children}
    </View>
  );
}
