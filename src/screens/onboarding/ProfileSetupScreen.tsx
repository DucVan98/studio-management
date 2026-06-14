import { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { authActions } from '../../stores/auth.store';
import { onboardingActions } from '../../stores/onboarding.store';
import { Button, Input, Icon, Alert } from '../../components/ui';
import { OnboardingScreen, OnboardingHeading } from '../../components/onboarding';
import { DIContainer } from '../../di/DIContainer';
import { useUploadAvatar } from '../../queries/hooks/user.queries';
import { AppError } from '../../domain/errors/AppError';

/** Màn 3 · Thiết lập hồ sơ (Figma 77:186). */
export function ProfileSetupScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [partnerNickname, setPartnerNickname] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const uploadAvatar = useUploadAvatar();

  // Chọn ảnh từ thư viện → preview ngay → upload lên S3 (cập nhật auth store khi xong)
  const handlePickAvatar = async () => {
    setAvatarError(null);
    try {
      const picked = await DIContainer.getInstance()
        .getImagePicker()
        .pickFromLibrary({ allowsEditing: true, aspect: [1, 1] });
      if (!picked) return;
      setAvatarUri(picked.uri);
      uploadAvatar.mutate(picked, {
        onError: err => setAvatarError(err.message),
      });
    } catch (err) {
      setAvatarError(err instanceof AppError ? err.message : 'Không thể chọn ảnh');
    }
  };

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

          {/* Avatar — chạm để chọn ảnh từ thư viện */}
          <View className="items-center mt-6">
            <TouchableOpacity activeOpacity={0.8} onPress={handlePickAvatar}>
              <View className="w-28 h-28 rounded-pill bg-surface-alt items-center justify-center overflow-hidden">
                {avatarUri ? (
                  <Image source={{ uri: avatarUri }} className="w-full h-full" resizeMode="cover" />
                ) : (
                  <Icon name="user" size={48} color="#D4537E" />
                )}
                {uploadAvatar.isPending && (
                  <View className="absolute inset-0 items-center justify-center bg-black/30">
                    <ActivityIndicator color="#FFFFFF" />
                  </View>
                )}
              </View>
              {/* Badge camera */}
              <View className="absolute bottom-0 right-0 w-9 h-9 rounded-pill bg-accent items-center justify-center border-2 border-bg">
                <Icon name="camera" size={18} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Lỗi chọn/upload avatar */}
          {avatarError && (
            <View className="mt-4">
              <Alert type="error" title={avatarError} onClose={() => setAvatarError(null)} />
            </View>
          )}

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

          <View className="mt-10">
            <Button label="Tiếp tục" fullWidth size="lg" onPress={handleContinue} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </OnboardingScreen>
  );
}
