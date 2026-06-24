import type { IHaptics } from './IHaptics';

/**
 * Impl rỗng — dùng khi nền tảng không hỗ trợ haptics (vd web) hoặc khi
 * expo-haptics chưa được cài. Giữ luồng UI chạy bình thường, không rung.
 */
export class NoopHaptics implements IHaptics {
  selection(): void {}
  impact(): void {}
  notify(): void {}
}
