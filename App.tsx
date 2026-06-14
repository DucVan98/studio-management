import './global.css';
import './src/i18n';

import { useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaInsetsContext,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import { NavigationContainer } from '@react-navigation/native';
import type { LinkingOptions } from '@react-navigation/native';
import { useValue } from '@legendapp/state/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { appStore$, appActions } from '@/stores';
import { authStore$, authActions } from '@/stores/auth.store';
import { onboardingActions } from '@/stores/onboarding.store';
import { themeVars } from '@/tokens';
import { queryClient } from '@/queries';
import { DIContainer } from '@/di/DIContainer.ts';
import { splashScreen } from '@/services/SplashScreenService.ts';
import { LINKING_PREFIXES, INVITE_ROUTE_PATH } from '@/config/links.ts';
import { RootNavigator } from './src/navigation/RootNavigator';
import type { RootStackParamList } from '@/navigation/types.ts';

// Nitro auto-show splash khi launch và giữ tới khi gọi hide() (autoHide=false mặc định),
// nên không cần preventAutoHide thủ công ở đây.

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: LINKING_PREFIXES,
  config: {
    screens: {
      PartnerAccept: INVITE_ROUTE_PATH,
    },
  },
};

// RN 0.85 + New Architecture: SecureStore.getItemAsync() đôi khi không resolve
// trong bridgeless mode → bootstrap treo vô thời hạn → splash screen không ẩn.
// Tổng ngân sách boot là 5s cho TẤT CẢ bước (restore + getCouple) — truyền
// deadline chung để không cộng dồn timeout của từng bước (tránh treo ~10s).
const BOOT_BUDGET_MS = 5000;
const withBootTimeout = (promise: Promise<unknown>, deadline: number): Promise<unknown> => {
  const remaining = Math.max(0, deadline - Date.now());
  return Promise.race([promise, new Promise<void>(resolve => setTimeout(resolve, remaining))]);
};

/**
 * Chỉ render children khi SafeAreaProvider đã đo xong insets (context khác null).
 * Dưới New Architecture/bridgeless, initialWindowMetrics thường null nên frame đầu
 * insets chưa có — gate ở đây để nội dung không paint với inset=0 rồi nhảy.
 */
function InsetsReadyGate({ children }: { children: ReactNode }) {
  const insets = useContext(SafeAreaInsetsContext);
  if (!insets) return null;
  return <>{children}</>;
}

/** Ẩn splash native ngay khi nội dung (đã có insets) được mount. */
function SplashHider() {
  useEffect(() => {
    const id = requestAnimationFrame(() => splashScreen.hide(200));
    return () => cancelAnimationFrame(id);
  }, []);
  return null;
}

export default function App() {
  const theme = useValue(appStore$.theme);
  const [booted, setBooted] = useState(false);
  const [sessionAuthenticated, setSessionAuthenticated] = useState(false);
  const [hasCouple, setHasCouple] = useState(false);
  // Load font DM Sans theo design Figma; fontError → vẫn render với System font
  const [fontsLoaded, fontError] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  useEffect(() => {
    async function bootstrap() {
      try {
        // DEV ONLY: uncomment dòng dưới để clear session (thay cho uninstall trên iOS)
        // await DIContainer.getInstance().session.clear();
        const deadline = Date.now() + BOOT_BUDGET_MS;
        const tokens = await withBootTimeout(DIContainer.getInstance().session.restore(), deadline);
        const authed = tokens !== null;
        setSessionAuthenticated(authed);

        // Xác định đã có couple chưa bằng cách hỏi server (GET /couple), KHÔNG
        // tin coupleId cũ trong MMKV — User1 sau khi partner accept không được
        // cập nhật coupleId nên restart sẽ bị đẩy nhầm vào màn Invite (→ 409).
        if (authed) {
          try {
            const couple = await withBootTimeout(
              DIContainer.getInstance().getGetCoupleUseCase().execute(),
              deadline,
            );
            if (couple && typeof couple === 'object' && 'id' in couple) {
              setHasCouple(true);
              authActions.updateUser({ coupleId: (couple as { id: string }).id });
            }
          } catch {
            // 403 COUPLE_NOT_FOUND hoặc lỗi mạng → fallback coupleId đã persist
            setHasCouple(!!authStore$.user.peek()?.coupleId);
          }
        }
        appActions.initialize();
      } catch {
        // tiếp tục với unauthenticated state
      } finally {
        setBooted(true);
      }
    }
    bootstrap();
  }, []);

  // Session hết hạn (refresh fail) → xoá cache để không lộ data cũ
  useEffect(() => {
    return DIContainer.getInstance().onSessionExpired(() => {
      queryClient.clear();
    });
  }, []);

  // Khi booted + fonts sẵn sàng → cho phép render nội dung (sẽ còn chờ insets).
  const appReady = booted && (fontsLoaded || !!fontError);

  // Safety net: nếu vì lý do gì insets không bao giờ sẵn sàng (vd web), vẫn ẩn
  // splash sau 2s để không kẹt splash vô hạn. Trường hợp thường: SplashHider ẩn trước.
  useEffect(() => {
    if (!appReady) return;
    const id = setTimeout(() => splashScreen.hide(200), 2000);
    return () => clearTimeout(id);
  }, [appReady]);

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <QueryClientProvider client={queryClient}>
        {/* themeVars inject CSS variables cho toàn bộ cây component */}
        <View style={[{ flex: 1 }, themeVars[theme]]}>
          <StatusBar style={theme === 'midnight-gold' ? 'light' : 'dark'} />
          {appReady && (
            // Chỉ render khi insets đã đo xong → nội dung paint thẳng ở đúng vị trí,
            // không còn cú nhảy "chạy từ trên xuống" (cả dev lẫn prod).
            <InsetsReadyGate>
              <SplashHider />
              <NavigationContainer linking={linking}>
                {/* Routing khi boot:
                    - Không có session → Welcome (đăng nhập/đăng ký)
                    - Có session + đã có couple → App (main tabs)
                    - Có session, chưa couple, ĐÃ chọn ngày bắt đầu → Invite
                      (đã qua ProfileSetup + StartDate, đang chờ kết nối)
                    - Có session, chưa couple, CHƯA chọn ngày → ProfileSetup
                      (đang dở onboarding, vd vừa verify OTP — resume tại đây) */}
                <RootNavigator initialRouteName={
                  !sessionAuthenticated
                    ? 'Welcome'
                    : hasCouple
                      ? 'App'
                      : onboardingActions.getRelationshipStartDate()
                        ? 'Invite'
                        : 'ProfileSetup'
                } />
              </NavigationContainer>
            </InsetsReadyGate>
          )}
        </View>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
