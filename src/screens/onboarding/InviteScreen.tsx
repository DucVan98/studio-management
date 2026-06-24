import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Share, ActivityIndicator } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useNavigation } from '@react-navigation/native';
import { DIContainer } from '../../di/DIContainer';
import { Button, Icon } from '../../components/ui';
import { OnboardingScreen } from '../../components/onboarding';
import { onboardingStore$, onboardingActions } from '../../stores/onboarding.store';
import { buildInviteLink } from '../../config/links';

/** Ô QR: hiển thị lỗi / mã QR / spinner tuỳ trạng thái tạo invite. */
function InviteQrBox({ code, error }: { code: string | null; error: boolean }) {
  return (
    <View className="items-center mt-8">
      <View className="w-[220px] h-[220px] bg-surface rounded-md items-center justify-center p-5">
        {error ? (
          <Text className="text-body-sm text-error text-center">
            Không tạo được mã mời. Thử lại sau.
          </Text>
        ) : code ? (
          <>
            <QRCode value={buildInviteLink(code)} size={140} color="#6B1A1A" backgroundColor="white" />
            <Text className="text-body-sm text-text-muted mt-3">Quét để kết nối</Text>
          </>
        ) : (
          <ActivityIndicator color="#D4537E" />
        )}
      </View>
    </View>
  );
}

/** Màn 5 · Mời nửa kia (Figma 9:2). */
export function InviteScreen() {
  const navigation = useNavigation();
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState(false);

  // Tạo invite một lần khi mount — gửi kèm startDate/dateType từ store
  // để backend lưu vào invite row và embed vào SSE payload khi partner accept
  useEffect(() => {
    let active = true;

    // Đã chuẩn hoá về YYYY-MM-DD theo giờ địa phương (an toàn với data cũ trong MMKV)
    const startDate = onboardingActions.getRelationshipStartDate() ?? undefined;
    const dateType = onboardingStore$.dateType.peek();

    // Map store DateType → API date_type string
    const dateTypeMap: Record<string, string> = {
      love: 'love',
      wedding: 'wedding',
      first_met: 'first-meet',
    };

    DIContainer.getInstance()
      .getCreateInviteUseCase()
      .execute({
        startDate,
        dateType: dateType ? dateTypeMap[dateType] : undefined,
      })
      .then((invite) => active && setCode(invite.code))
      .catch(() => active && setError(true));
    return () => {
      active = false;
    };
  }, []);

  // Khi có code, mở SSE connection — server sẽ push event khi partner accept.
  // Không cần poll: một HTTP connection duy nhất giữ mở, zero overhead khi idle.
  useEffect(() => {
    if (!code) return;

    const cleanup = DIContainer.getInstance()
      .getInviteSSEClient()
      .watch(code, ({ partnerName, startDate }) => {
        // Nhận event "accepted" từ server → User1 cũng được màn Connected
        // như User2, không bị văng thẳng vào App mà thiếu celebration
        navigation.reset({
          index: 0,
          routes: [{ name: 'Connected', params: { partnerName, startDate } }],
        });
      });

    // Cleanup đóng AbortController → server biết user1 đã rời màn hình
    return cleanup;
  }, [code, navigation]);

  // Deep link để User2 mở app trực tiếp (không qua browser)
  const link = code ? buildInviteLink(code) : '';

  // Không có lib clipboard — dùng native Share sheet (có sẵn hành động Copy).
  const share = () => {
    if (!link) return;
    Share.share({ message: `Cùng mình bắt đầu hành trình trên Everly nhé 💕 ${link}` });
  };

  const goHome = () => navigation.reset({ index: 0, routes: [{ name: 'App' }] });

  return (
    <OnboardingScreen>
      <View className="flex-1 px-6 pt-4 pb-8">
        {/* Progress dots */}
        <View className="flex-row justify-center items-center gap-1.5 mb-6">
          {[0, 1, 2, 3, 4].map((i) => (
            <View
              key={i}
              className={`h-1.5 rounded-pill ${i === 4 ? 'w-5 bg-accent' : 'w-1.5 bg-border'}`}
            />
          ))}
        </View>

        <View className="flex-row items-center justify-center gap-2">
          <Text className="font-serif text-display-md text-text text-center">
            Mời nửa kia
          </Text>
          <Icon name="mail" size="xl" color="#D4537E" />
        </View>
        <Text className="text-body-md text-text-muted text-center mt-2 px-2">
          Gửi mã QR hoặc link để kết nối hai bạn vào chung một không gian
        </Text>

        {/* QR */}
        <InviteQrBox code={code} error={error} />

        {/* hoặc */}
        <View className="flex-row items-center my-6">
          <View className="flex-1 h-px bg-border" />
          <Text className="mx-3 text-body-sm text-text-muted">hoặc</Text>
          <View className="flex-1 h-px bg-border" />
        </View>

        {/* Link + copy */}
        <View className="flex-row items-center bg-surface rounded-md h-12 pl-4 pr-1.5">
          <Text className="flex-1 text-body-md text-text" numberOfLines={1}>
            {link || '...'}
          </Text>
          <TouchableOpacity
            onPress={share}
            disabled={!code}
            className="h-8 px-4 rounded-pill bg-surface-alt items-center justify-center"
          >
            <Text className="text-body-sm font-medium text-accent">Copy</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-1" />

        <Button
          label="Chia sẻ lời mời"
          fullWidth
          size="lg"
          leftIcon="send"
          disabled={!code}
          onPress={share}
        />
        <TouchableOpacity
          className="items-center mt-4"
          onPress={() => navigation.navigate('EnterCode')}
        >
          <Text className="text-body-md text-accent font-medium">Tôi nhận được mã mời</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center mt-4" onPress={goHome}>
          <Text className="text-body-md text-text-muted">Để sau</Text>
        </TouchableOpacity>
      </View>
    </OnboardingScreen>
  );
}
