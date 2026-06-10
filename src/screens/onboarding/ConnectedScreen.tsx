import { View, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useValue } from '@legendapp/state/react';
import { authStore$ } from '../../stores/auth.store';
import { Button } from '../../components/ui';
import { OnboardingScreen } from '../../components/onboarding';
import type { RootStackParamList } from '../../navigation/types';

/** Confetti trang trí (vị trí cố định, không tương tác). */
const CONFETTI = [
  { top: 40, left: 24 }, { top: 18, right: 36 }, { top: 110, right: 60 },
  { top: 150, left: 40 }, { top: 8, left: 130 }, { top: 90, left: 96 },
  { top: 170, right: 30 },
];

/** Màn 7 · Kết nối thành công (Figma 80:217). */
export function ConnectedScreen() {
  const navigation = useNavigation();
  const { partnerName, startDate } =
    useRoute<RouteProp<RootStackParamList, 'Connected'>>().params ?? {};
  const user = useValue(authStore$.user);
  const me = user?.name ?? 'Bạn';
  const partner = partnerName ?? 'Nửa kia';

  const days = startDate
    ? Math.max(0, Math.floor((Date.now() - new Date(startDate).getTime()) / 86_400_000))
    : 0;

  return (
    <OnboardingScreen>
      <View className="flex-1 px-6 pt-4 pb-8">
        {/* Confetti */}
        <View className="absolute inset-0">
          {CONFETTI.map((pos, i) => (
            <View
              key={i}
              className={`absolute w-3 h-3 rounded-sm ${i % 2 ? 'bg-accent-2' : 'bg-accent'}`}
              style={pos}
            />
          ))}
        </View>

        <View className="flex-1 items-center justify-center">
          {/* Avatars */}
          <View className="flex-row items-center">
            <View className="w-28 h-28 rounded-pill bg-accent items-center justify-center">
              <Text className="font-serif text-display-md text-on-accent">
                {me.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View className="w-28 h-28 rounded-pill bg-accent-2 items-center justify-center -ml-6 border-4 border-bg">
              <Text className="font-serif text-display-md text-on-accent">
                {partner.charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>

          <Text className="font-serif text-display-md text-text text-center mt-8">
            Đã kết nối! 🎉
          </Text>
          <Text className="font-serif text-heading-xl text-accent text-center mt-2">
            {me} & {partner}
          </Text>
          <Text className="text-body-md text-text-muted text-center mt-3 px-4">
            Không gian chung của hai bạn đã sẵn sàng. Hành trình bắt đầu từ hôm nay 💞
          </Text>

          {/* Stat card */}
          <View className="bg-surface-alt rounded-md py-5 px-8 mt-6 items-center">
            <Text className="text-body-sm text-text-muted">Cùng nhau được</Text>
            <Text className="font-serif text-display-md text-accent mt-1">
              {days.toLocaleString('vi-VN')} ngày
            </Text>
          </View>
        </View>

        <Button
          label="Vào trang chủ"
          fullWidth
          size="lg"
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'App' }] })}
        />
      </View>
    </OnboardingScreen>
  );
}
