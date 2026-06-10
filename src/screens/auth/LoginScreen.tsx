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
import { authActions } from '../../stores/auth.store';
import { Button, Input } from '../../components/ui';
import {
  OnboardingScreen,
  OnboardingHeading,
  OrDivider,
  SocialAuthButtons,
} from '../../components/onboarding';

export function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Có lỗi xảy ra', 'Vui lòng nhập email và mật khẩu');
      return;
    }

    setLoading(true);
    try {
      const loginUseCase = DIContainer.getInstance().getLoginUseCase();
      const { user, tokens } = await loginUseCase.execute({ email, password });

      // Token đã được AuthSessionService lưu vào SecureStore, AuthHttpClient tự
      // gắn Bearer — chỉ cần cập nhật store.
      authActions.login(
        { id: user.id, email: user.email, name: user.name, avatar: user.avatarUrl },
        tokens.accessToken,
      );

      navigation.reset({ index: 0, routes: [{ name: 'App' }] });
    } catch (error) {
      Alert.alert(
        'Có lỗi xảy ra',
        error instanceof Error ? error.message : 'Email hoặc mật khẩu không đúng',
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
          contentContainerClassName="flex-grow px-6 pt-4 pb-8"
          keyboardShouldPersistTaps="handled"
        >
          <OnboardingHeading title="Đăng nhập" subtitle="Chào mừng trở lại 💕" />

          {/* Form */}
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
            <Input
              label="Mật khẩu"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="current-password"
            />

            <TouchableOpacity
              className="self-end"
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text className="text-body-sm text-accent font-medium">
                Quên mật khẩu?
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-6">
            <Button
              label="Đăng nhập"
              fullWidth
              size="lg"
              loading={loading}
              onPress={handleLogin}
            />
          </View>

          <OrDivider />

          <SocialAuthButtons
            onApple={() => Alert.alert('Sắp ra mắt', 'Đăng nhập với Apple đang được hoàn thiện')}
            onGoogle={() => Alert.alert('Sắp ra mắt', 'Đăng nhập với Google đang được hoàn thiện')}
          />

          {/* Footer */}
          <View className="flex-1" />
          <View className="flex-row justify-center mt-8">
            <Text className="text-body-md text-text-muted">Chưa có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text className="text-body-md text-accent font-medium">Đăng ký</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </OnboardingScreen>
  );
}
