import type { IHaptics, ImpactStrength, NotifyType } from './IHaptics';

/**
 * Impl haptics bằng `expo-haptics` — đây là FILE DUY NHẤT được phép biết tới
 * thư viện này (theo rule bọc thư viện bên thứ 3).
 *
 * Lưu ý cài đặt: `expo-haptics` được nạp ĐỘNG qua require + guard, vì:
 *   1) Nếu chưa cài (hoặc nền tảng không hỗ trợ) thì app vẫn chạy, tự fallback
 *      sang NoopHaptics ở DIContainer.
 *   2) Khi đã chạy `npx expo install expo-haptics` và rebuild dev client, impl
 *      này tự kích hoạt mà không cần sửa thêm dòng nào.
 */

// Hình dạng tối thiểu của expo-haptics mà app dùng tới (không phụ thuộc type của lib).
interface ExpoHapticsModule {
  selectionAsync: () => Promise<void>;
  impactAsync: (style?: number) => Promise<void>;
  notificationAsync: (type?: number) => Promise<void>;
  ImpactFeedbackStyle: { Light: number; Medium: number; Heavy: number };
  NotificationFeedbackType: { Success: number; Warning: number; Error: number };
}

function loadModule(): ExpoHapticsModule | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod: unknown = require('expo-haptics');
    return mod as ExpoHapticsModule;
  } catch {
    return null;
  }
}

export class ExpoHaptics implements IHaptics {
  private readonly mod = loadModule();

  /** true nếu expo-haptics nạp được — DIContainer dùng để quyết định fallback. */
  static isAvailable(): boolean {
    return loadModule() !== null;
  }

  selection(): void {
    // Nuốt mọi lỗi: haptics là hiệu ứng phụ, không được làm vỡ luồng UI.
    void this.mod?.selectionAsync().catch(() => undefined);
  }

  impact(strength: ImpactStrength = 'medium'): void {
    const m = this.mod;
    if (!m) return;
    const style =
      strength === 'light'
        ? m.ImpactFeedbackStyle.Light
        : strength === 'heavy'
          ? m.ImpactFeedbackStyle.Heavy
          : m.ImpactFeedbackStyle.Medium;
    void m.impactAsync(style).catch(() => undefined);
  }

  notify(type: NotifyType): void {
    const m = this.mod;
    if (!m) return;
    const t =
      type === 'success'
        ? m.NotificationFeedbackType.Success
        : type === 'warning'
          ? m.NotificationFeedbackType.Warning
          : m.NotificationFeedbackType.Error;
    void m.notificationAsync(t).catch(() => undefined);
  }
}
