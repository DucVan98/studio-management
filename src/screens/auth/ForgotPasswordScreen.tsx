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
import { DIContainer } from '../../di/DIContainer';
import { Button, Input, Icon } from '../../components/ui';
import { OnboardingScreen } from '../../components/onboarding';

/** Màn Quên mật khẩu (Figma 176:960). */
export function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) {
      Alert.alert('Có lỗi xảy ra', 'Vui lòng nhập email');
      return;
    }
    setLoading(true);
    try {
      await DIContainer.getInstance().getForgotPasswordUseCase().execute(email);
      // Server luôn trả 200 để chống dò email — thông báo chung.
      Alert.alert(
        'Đã gửi',
        'Nếu email tồn tại, chúng tôi đã gửi link đặt lại mật khẩu. Vui lòng kiểm tra hộp thư.',
        [{ text: 'Xác nhận', onPress: () => navigation.goBack() }],
      );
    } catch (error) {
      Alert.alert(
        'Có lỗi xảy ra',
        error instanceof Error ? error.message : 'Không thể gửi yêu cầu',
      );
    } finally {
      setLoading(false);
    }
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
          {/* Icon */}
          <View className="items-center mt-6">
            <View className="w-16 h-16 rounded-pill bg-surface-alt items-center justify-center">
              <Icon name="lock" size={34} color="#D4537E" />
            </View>
            <Text className="font-serif text-display-md text-text mt-6 text-center">
              Quên mật khẩu?
            </Text>
            <Text className="text-body-md text-text-muted mt-3 text-center px-2">
              Nhập email, chúng tôi sẽ gửi link để bạn đặt lại mật khẩu
            </Text>
          </View>

          <View className="gap-4 mt-8">
            <Input
              label="Email"
              placeholder="ban@email.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
            <Button
              label="Gửi link đặt lại"
              fullWidth
              size="lg"
              loading={loading}
              onPress={handleReset}
            />
          </View>

          <View className="flex-1" />
          <TouchableOpacity className="items-center mt-8" onPress={() => navigation.goBack()}>
            <Text className="text-body-md text-accent font-medium">
              Quay lại đăng nhập
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </OnboardingScreen>
  );
}
