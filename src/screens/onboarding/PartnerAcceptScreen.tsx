import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { DIContainer } from '../../di/DIContainer';
import { authActions } from '../../stores/auth.store';
import { onboardingActions } from '../../stores/onboarding.store';
import { Button, Icon, Alert } from '../../components/ui';
import { OnboardingScreen } from '../../components/onboarding';
import type { RootStackParamList } from '../../navigation/types';

const pad = (n: number) => String(n).padStart(2, '0');

/** Màn 6 · Partner xác nhận lời mời (Figma 79:204). Vào qua deep link join/:code */
export function PartnerAcceptScreen() {
  const navigation = useNavigation();
  const { code, inviterName } =
    useRoute<RouteProp<RootStackParamList, 'PartnerAccept'>>().params;
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  // Tên/avatar người mời: ưu tiên dữ liệu fetch từ invite, fallback route param
  const [inviterDisplay, setInviterDisplay] = useState<string | null>(inviterName ?? null);
  const [inviterAvatar, setInviterAvatar] = useState<string | null>(null);
  const inviter = inviterDisplay ?? 'Người ấy';

  // Vào qua deep link/QR nhưng chưa đăng nhập → lưu code, đẩy về Welcome.
  // Sau khi đăng nhập/đăng ký xong sẽ tự quay lại màn này (xem ProfileSetup/Login).
  useEffect(() => {
    if (code && !authActions.isAuthenticated()) {
      onboardingActions.setPendingInviteCode(code);
      navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
    }
  }, [code, navigation]);

  const [daysTogether, setDaysTogether] = useState<number | null>(null);
  useEffect(() => {
    if (!code || !authActions.isAuthenticated()) return;
    let active = true;
    DIContainer.getInstance()
      .getGetInviteUseCase()
      .execute(code)
      .then((invite) => {
        if (active) {
          // Ưu tiên startDate User1 đã chọn; fallback về createdAt nếu backend chưa trả
          const date = invite.startDate ?? invite.createdAt.slice(0, 10);
          setStartDate(date);
          setDaysTogether(Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 86_400_000)));
          if (invite.inviterName) setInviterDisplay(invite.inviterName);
          if (invite.inviterAvatarUrl) setInviterAvatar(invite.inviterAvatarUrl);
        }
      })
      .catch(() => {
        if (active) { setStartDate(null); setDaysTogether(null); }
      });
    return () => { active = false; };
  }, [code]);

  const handleAccept = async () => {
    setErrorMsg(null);
    if (!code) {
      setErrorMsg('Thiếu mã lời mời');
      return;
    }
    setLoading(true);
    try {
      const today = new Date();
      const date =
        startDate ??
        `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
      const couple = await DIContainer.getInstance()
        .getAcceptInviteUseCase()
        .execute({ code, startDate: date });

      authActions.updateUser({ coupleId: couple.id });
      navigation.reset({
        index: 0,
        routes: [{ name: 'Connected', params: { partnerName: inviter, startDate: date } }],
      });
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Không thể chấp nhận lời mời');
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingScreen>
      <View className="flex-1 px-6 pt-4 pb-8">
        {/* Badge */}
        <View className="self-center flex-row items-center gap-1.5 h-8 px-4 rounded-pill bg-surface-alt">
          <Icon name="heart" size="xs" color="#D4537E" />
          <Text className="text-body-sm font-medium text-accent">Lời mời kết nối</Text>
        </View>

        {/* Avatars */}
        <View className="flex-row items-center justify-center gap-3 mt-8">
          <View className="w-20 h-20 rounded-pill bg-accent items-center justify-center overflow-hidden">
            {inviterAvatar ? (
              <Image source={{ uri: inviterAvatar }} className="w-full h-full" resizeMode="cover" />
            ) : (
              <Text className="font-serif text-heading-xl text-on-accent">
                {inviter.charAt(0).toUpperCase()}
              </Text>
            )}
          </View>
          <Icon name="heart" size={28} color="#D4537E" />
          <View className="w-20 h-20 rounded-pill bg-surface-alt items-center justify-center">
            <Icon name="user" size={36} color="#D4537E" />
          </View>
        </View>

        <Text className="font-serif text-heading-xl text-text text-center mt-8 px-2">
          {inviter} muốn bắt đầu hành trình Everly cùng bạn
        </Text>
        <Text className="text-body-md text-text-muted text-center mt-3 px-2">
          Chấp nhận để cùng nhau lưu giữ kỷ niệm và đếm từng ngày yêu
        </Text>

        {errorMsg && (
          <View className="mt-4">
            <Alert type="error" title="Có lỗi xảy ra" message={errorMsg} onClose={() => setErrorMsg(null)} />
          </View>
        )}

        {/* Info card */}
        <View className="bg-surface rounded-md p-5 mt-4 gap-4">
          <View className="flex-row items-center gap-3">
            <Icon name="user" size="md" color="#B07A86" />
            <View>
              <Text className="text-body-sm text-text-muted">Người mời</Text>
              <Text className="text-body-md text-text mt-0.5">{inviter}</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-3">
            <Icon name="calendar" size="md" color="#B07A86" />
            <View>
              <Text className="text-body-sm text-text-muted">Ngày bắt đầu</Text>
              <Text className="text-body-md text-text mt-0.5">
                {startDate
                  ? `${startDate.split('-').reverse().join(' . ')}${
                      daysTogether !== null
                        ? ` (${daysTogether.toLocaleString('vi-VN')} ngày)`
                        : ''
                    }`
                  : 'Đang tải...'}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-1" />

        <Button
          label="Chấp nhận & Kết nối"
          fullWidth
          size="lg"
          loading={loading}
          onPress={handleAccept}
        />
        <TouchableOpacity
          className="items-center mt-5"
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Invite' }] })}
        >
          <Text className="text-body-md text-text-muted">Từ chối</Text>
        </TouchableOpacity>
      </View>
    </OnboardingScreen>
  );
}
