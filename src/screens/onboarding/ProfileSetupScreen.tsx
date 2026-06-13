import { useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { authActions } from '../../stores/auth.store';
import { onboardingActions } from '../../stores/onboarding.store';
import { Button, Input, Icon, Alert } from '../../components/ui';
import { OnboardingScreen, OnboardingHeading } from '../../components/onboarding';

/** Màn 3 · Thiết lập hồ sơ (Figma 77:186). */
export function ProfileSetupScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [partnerNickname, setPartnerNickname] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);

  const handleContinue = () => {
    if (!name.trim()) {
      setNameError('Vui lòng nhập tên của bạn');
      return;
    }
    setNameError(null);
    authActions.updateUser({ name, partnerNickname });

    // Nếu vào từ deep link mời (User2): bỏ qua StartDate/Invite, sang thẳng PartnerAccept
    const pendingCode = onboardingActions.getPendingInviteCode();
    if (pendingCode) {
      onboardingActions.setPendingInviteCode(null);
      navigation.reset({ index: 0, routes: [{ name: 'PartnerAccept', params: { code: pendingCode } }] });
      return;
    }
    navigation.navigate('StartDate');
  };

  return (
    <OnboardingScreen showBack>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow px-6 pt-2 pb-8"
          keyboardShouldPersistTaps="handled"
        >
          <OnboardingHeading
            title="Hồ sơ của bạn"
            subtitle="Để nửa kia nhận ra bạn ngay"
          />

          {/* Lỗi validation tên */}
          {nameError && (
            <View className="mt-4">
              <Alert type="error" title={nameError} onClose={() => setNameError(null)} />
            </View>
          )}

          {/* Avatar — camera icon ẩn cho đến khi có feature upload ảnh */}
          <View className="items-center mt-6">
            <View className="w-28 h-28 rounded-pill bg-surface-alt items-center justify-center">
              <Icon name="user" size={48} color="#D4537E" />
            </View>
          </View>

          <View className="gap-4 mt-6">
            <Input
              label="Tên của bạn"
              placeholder="Linh"
              value={name}
              onChangeText={setName}
            />
            <Input
              label="Bạn gọi nửa kia là..."
              placeholder="Gấu 🐻"
              value={partnerNickname}
              onChangeText={setPartnerNickname}
            />
          </View>

          <View className="flex-1" />
          <Button label="Tiếp tục" fullWidth size="lg" onPress={handleContinue} />
        </ScrollView>
      </KeyboardAvoidingView>
    </OnboardingScreen>
  );
}
