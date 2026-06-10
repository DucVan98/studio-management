import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { authActions } from '../../stores/auth.store';
import { Button, Input, Icon } from '../../components/ui';
import { OnboardingScreen, OnboardingHeading } from '../../components/onboarding';

/** Màn 3 · Thiết lập hồ sơ (Figma 77:186). */
export function ProfileSetupScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [partnerNickname, setPartnerNickname] = useState('');

  const handleContinue = () => {
    if (!name.trim()) {
      Alert.alert('Có lỗi xảy ra', 'Vui lòng nhập tên của bạn');
      return;
    }
    // TODO: ghép API cập nhật hồ sơ (chưa có UpdateProfileUseCase). Tạm lưu local.
    authActions.updateUser({ name, partnerNickname });
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

          {/* Avatar */}
          <View className="items-center mt-8">
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() =>
                Alert.alert('Sắp ra mắt', 'Chọn ảnh đại diện đang được hoàn thiện')
              }
            >
              <View className="w-28 h-28 rounded-pill bg-surface-alt items-center justify-center">
                <Icon name="user" size={48} color="#D4537E" />
              </View>
              <View className="absolute bottom-0 right-0 w-9 h-9 rounded-pill bg-accent items-center justify-center border-2 border-bg">
                <Icon name="camera" size={18} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
            <Text className="text-body-sm text-text-muted mt-3">Thêm ảnh đại diện</Text>
          </View>

          {/* Form */}
          <View className="gap-4 mt-8">
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
