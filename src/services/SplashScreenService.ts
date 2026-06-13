import { NitroSplash } from '@ducanh261101a/react-native-nitro-splash';

/**
 * Interface splash screen riêng của app — chỉ phơi ra những gì app cần,
 * không sao chép nguyên API của thư viện bên dưới.
 */
export interface ISplashScreen {
  /** Ẩn splash, có thể fade-out trong `fadeDurationMs` mili-giây. */
  hide(fadeDurationMs?: number): void;
  /** Giữ splash lại khi native init với autoHide = true. */
  preventAutoHide(): void;
  /** Splash đang hiển thị hay không. */
  readonly isVisible: boolean;
}

/**
 * Adapter bọc `@ducanh261101a/react-native-nitro-splash`.
 * Đây là FILE DUY NHẤT được import thư viện này — nơi khác chỉ phụ thuộc ISplashScreen.
 */
class NitroSplashScreenAdapter implements ISplashScreen {
  hide(fadeDurationMs = 0): void {
    NitroSplash.hide({ fadeDurationMs });
  }

  preventAutoHide(): void {
    NitroSplash.preventAutoHide();
  }

  get isVisible(): boolean {
    return NitroSplash.isVisible;
  }
}

export const splashScreen: ISplashScreen = new NitroSplashScreenAdapter();