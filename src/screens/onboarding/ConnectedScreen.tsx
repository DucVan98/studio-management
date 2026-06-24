import { useEffect, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useValue } from '@legendapp/state/react';
import { authStore$ } from '../../stores/auth.store';
import { DIContainer } from '../../di/DIContainer';
import { Button, Confetti, AvatarPair, AnimatedCounter } from '../../components/ui';
import { OnboardingScreen } from '../../components/onboarding';
import type { RootStackParamList } from '../../navigation/types';

/** Màn 7 · Kết nối thành công (Figma 80:217). */
export function ConnectedScreen() {
  const navigation = useNavigation();
  const { partnerName, startDate } =
    useRoute<RouteProp<RootStackParamList, 'Connected'>>().params ?? {};
  const user = useValue(authStore$.user);
  const me = user?.name ?? 'Bạn';
  const partner = partnerName ?? 'Nửa kia';

  const [days] = useState(() => {
    if (!startDate) return 0;
    return Math.max(0, Math.floor((Date.now() - new Date(startDate).getTime()) / 86_400_000));
  });

  // Token hiện tại được cấp TRƯỚC khi couple được tạo → claim couple_id vẫn là
  // 00000000-… nên các API /couple/* sẽ trả 404. Ép refresh ngay khi vào màn này
  // để JWT mới mang couple_id thật, trước khi user bấm "Vào trang chủ".
  const refreshing = useRef<Promise<string | null> | null>(null);
  useEffect(() => {
    refreshing.current = DIContainer.getInstance().session.refreshAccessToken();
  }, []);

  // Đợi refresh xong rồi mới reset sang App (tránh race gọi /couple/stats bằng
  // token cũ). Refresh là single-flight nên await lại cùng promise là an toàn.
  const goHome = async () => {
    try {
      await refreshing.current;
    } catch {
      // refresh fail → vẫn vào App; interceptor 401 sẽ xử lý/đẩy về login nếu cần
    }
    navigation.reset({ index: 0, routes: [{ name: 'App' }] });
  };

  return (
    <OnboardingScreen>
      <View className="flex-1 px-6 pt-4 pb-8">
        {/* Confetti ăn mừng — chạy khi vào màn */}
        <Confetti count={28} />

        <View className="flex-1 items-center justify-center">
          {/* Hai avatar trượt lại gần + tim bật ra */}
          <AvatarPair
            left={{ name: me, color: 'accent' }}
            right={{ name: partner, color: 'rose' }}
            size="xl"
            animateJoin
          />

          <Text className="font-serif text-display-md text-text text-center mt-8">
            Đã kết nối! 🎉
          </Text>
          <Text className="font-serif text-heading-xl text-accent text-center mt-2">
            {me} & {partner}
          </Text>
          <Text className="text-body-md text-text-muted text-center mt-3 px-4">
            Không gian chung của hai bạn đã sẵn sàng. Hành trình bắt đầu từ hôm nay 💞
          </Text>

          {/* Stat card — số ngày đếm tăng dần */}
          <View className="bg-surface-alt rounded-md py-5 px-8 mt-6 items-center">
            <Text className="text-body-sm text-text-muted">Cùng nhau được</Text>
            <View className="flex-row items-baseline mt-1">
              <AnimatedCounter value={days} className="font-serif text-display-md text-accent" />
              <Text className="font-serif text-heading-lg text-accent ml-1">ngày</Text>
            </View>
          </View>
        </View>

        <Button
          label="Vào trang chủ"
          fullWidth
          size="lg"
          onPress={goHome}
        />
      </View>
    </OnboardingScreen>
  );
}
