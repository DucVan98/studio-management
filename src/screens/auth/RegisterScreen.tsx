import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DIContainer } from '../../di/DIContainer';
import { EmailUnverifiedError } from '../../domain/errors/AppError';
import { Button, Input, Alert } from '../../components/ui';
import type { AlertType } from '../../components/ui';
import {
  OnboardingScreen,
  OnboardingHeading,
  OrDivider,
  SocialAuthButtons,
} from '../../components/onboarding';

type AlertState = { type: AlertType; title: string; message?: string };

export function RegisterScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertState | null>(null);

  const handleRegister = async () => {
    setAlert(null);
    if (!email.trim() || !password.trim()) {
      setAlert({ type: 'error', title: 'Vui lòng nhập email và mật khẩu' });
      return;
    }
    if (password !== confirm) {
      setAlert({ type: 'error', title: 'Mật khẩu xác nhận không khớp' });
      return;
    }

    setLoading(true);
    try {
      const registerUseCase = DIContainer.getInstance().getRegisterUseCase();
      const name = (email.trim().split('@')[0] || 'Bạn').slice(0, 50);
      const { userId } = await registerUseCase.execute({ name, email, password });
      navigation.navigate('VerifyEmail', { userId, email });
    } catch (error) {
      if (EmailUnverifiedError.is(error)) {
        navigation.navigate('VerifyEmail', { userId: error.userId, email });
        return;
      }
      setAlert({
        type: 'error',
        title: 'Đăng ký thất bại',
        message: error instanceof Error ? error.message : 'Không thể tạo tài khoản',
      });
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
          <OnboardingHeading
            title="Tạo tài khoản"
            subtitle="Bắt đầu hành trình của hai bạn 💕"
          />

          {alert && (
            <View className="mt-4">
              <Alert {...alert} onClose={() => setAlert(null)} />
            </View>
          )}

          <View className="gap-4 mt-6">
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
              autoComplete="new-password"
              hint="Tối thiểu 8 ký tự"
            />
            <Input
              label="Xác nhận mật khẩu"
              placeholder="••••••••"
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry
              autoComplete="new-password"
            />
          </View>

          <View className="mt-6">
            <Button
              label="Tiếp tục"
              fullWidth
              size="lg"
              loading={loading}
              onPress={handleRegister}
            />
          </View>

          <OrDivider />

          <SocialAuthButtons
            onApple={() => setAlert({ type: 'info', title: 'Sắp ra mắt', message: 'Đăng ký với Apple đang được hoàn thiện' })}
            onGoogle={() => setAlert({ type: 'info', title: 'Sắp ra mắt', message: 'Đăng ký với Google đang được hoàn thiện' })}
          />

          <Text className="text-body-sm text-text-muted text-center mt-6 px-2">
            Bằng việc tiếp tục, bạn đồng ý với{' '}
            <Text
              className="text-accent"
              onPress={() => Linking.openURL('https://everly.app/terms')}
            >
              Điều khoản
            </Text>{' '}
            &amp;{' '}
            <Text
              className="text-accent"
              onPress={() => Linking.openURL('https://everly.app/privacy')}
            >
              Chính sách bảo mật
            </Text>
          </Text>

          <View className="flex-1" />
          <View className="flex-row justify-center mt-8">
            <Text className="text-body-md text-text-muted">Đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text className="text-body-md text-accent font-medium">Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </OnboardingScreen>
  );
}
