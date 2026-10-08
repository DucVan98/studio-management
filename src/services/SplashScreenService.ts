import * as SplashScreen from 'expo-splash-screen';

/**
 * Interface splash screen riêng của app — chỉ phơi ra những gì app cần,
 * không sao chép nguyên API của thư viện bên dưới.
 */
export interface ISplashScreen {
  /** Ẩn splash, có thể fade-out trong `fadeDurationMs` mili-giây. */
  hide(fadeDurationMs?: number): Promise<void>;
  /** Giữ splash lại khi native init. */
  preventAutoHide(): Promise<void>;
}

/**
 * Adapter bọc `expo-splash-screen`.
 * Đây là FILE DUY NHẤT được import thư viện này — nơi khác chỉ phụ thuộc ISplashScreen.
 */
class ExpoSplashScreenAdapter implements ISplashScreen {
  async hide(fadeDurationMs = 500): Promise<void> {
    try {
      await SplashScreen.hideAsync();
    } catch (e) {
      console.warn('Failed to hide splash screen:', e);
    }
  }

  async preventAutoHide(): Promise<void> {
    try {
      await SplashScreen.preventAutoHideAsync();
    } catch (e) {
      console.warn('Failed to prevent auto hide:', e);
    }
  }
}

export const splashScreen: ISplashScreen = new ExpoSplashScreenAdapter();