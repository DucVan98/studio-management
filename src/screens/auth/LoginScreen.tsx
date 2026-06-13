import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DIContainer } from '../../di/DIContainer';
import { EmailUnverifiedError } from '../../domain/errors/AppError';
import { authActions } from '../../stores/auth.store';
import { onboardingActions } from '../../stores/onboarding.store';
import { Button, Input, Alert } from '../../components/ui';
import type { AlertType } from '../../components/ui';
import {
  OnboardingScreen,
  OnboardingHeading,
  OrDivider,
  SocialAuthButtons,
} from '../../components/onboarding';

type AlertState = { type: AlertType; title: string; message?: string };

export function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertState | null>(null);

  const handleLogin = async () => {
    setAlert(null);
    if (!email.trim() || !password.trim()) {
      setAlert({ type: 'error', title: 'Vui lòng nhập email và mật khẩu' });
      return;
    }

    setLoading(true);
    try {
      const loginUseCase = DIContainer.getInstance().getLoginUseCase();
      const { user, tokens } = await loginUseCase.execute({ email, password });

      authActions.login(
        { id: user.id, email: user.email, name: user.name, avatar: user.avatarUrl, coupleId: user.coupleId },
        tokens.accessToken,
      );

      // Đăng nhập từ deep link mời (chưa có couple) → sang thẳng PartnerAccept
      const pendingCode = onboardingActions.getPendingInviteCode();
      if (pendingCode && !user.coupleId) {
        onboardingActions.setPendingInviteCode(null);
        navigation.reset({ index: 0, routes: [{ name: 'PartnerAccept', params: { code: pendingCode } }] });
        return;
      }

      const nextRoute = user.coupleId ? 'App' : 'Invite';
      navigation.reset({ index: 0, routes: [{ name: nextRoute }] });
    } catch (error) {
      if (EmailUnverifiedError.is(error)) {
        navigation.navigate('VerifyEmail', { userId: error.userId, email });
        return;
      }
      setAlert({
        type: 'error',
        title: 'Đăng nhập thất bại',
        message: error instanceof Error ? error.message : 'Email hoặc mật khẩu không đúng',
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
          <OnboardingHeading title="Đăng nhập" subtitle="Chào mừng trở lại 💕" />

          {/* Alert lỗi — hiện ngay dưới heading */}
          {alert && (
            <View className="mt-4">
              <Alert {...alert} onClose={() => setAlert(null)} />
            </View>
          )}

          {/* Form */}
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
            onApple={() => setAlert({ type: 'info', title: 'Sắp ra mắt', message: 'Đăng nhập với Apple đang được hoàn thiện' })}
            onGoogle={() => setAlert({ type: 'info', title: 'Sắp ra mắt', message: 'Đăng nhập với Google đang được hoàn thiện' })}
          />

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
