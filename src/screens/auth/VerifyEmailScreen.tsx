import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { DIContainer } from '../../di/DIContainer';
import { authActions } from '../../stores/auth.store';
import { Button, Icon, Alert, OtpInput } from '../../components/ui';
import type { AlertType } from '../../components/ui';
import { OnboardingScreen } from '../../components/onboarding';
import type { RootStackParamList } from '../../navigation/types';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 45;

type AlertState = { type: AlertType; title: string; message?: string };

/** Màn Xác thực email — OTP 6 số (Figma 176:981). */
export function VerifyEmailScreen() {
  const navigation = useNavigation();
  const { userId, email } = useRoute<RouteProp<RootStackParamList, 'VerifyEmail'>>().params;
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [alert, setAlert] = useState<AlertState | null>(null);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  const handleVerify = async (value: string) => {
    setAlert(null);
    if (!userId) {
      setAlert({ type: 'error', title: 'Thiếu thông tin tài khoản, vui lòng đăng ký lại' });
      return;
    }
    setLoading(true);
    try {
      const useCase = DIContainer.getInstance().getVerifyEmailUseCase();
      const { user, tokens } = await useCase.execute({ userId, code: value });

      authActions.login(
        { id: user.id, email: user.email, name: user.name, avatar: user.avatarUrl, coupleId: user.coupleId },
        tokens.accessToken,
      );
      navigation.reset({ index: 0, routes: [{ name: 'ProfileSetup' }] });
    } catch (error) {
      setCode('');
      setAlert({
        type: 'error',
        title: 'Mã xác thực không đúng',
        message: error instanceof Error ? error.message : 'Vui lòng thử lại',
      });
    } finally {
      setLoading(false);
    }
  };

  const onChange = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, OTP_LENGTH);
    setCode(digits);
    if (digits.length === OTP_LENGTH) handleVerify(digits);
  };

  const resend = async () => {
    if (!userId) return;
    setAlert(null);
    try {
      await DIContainer.getInstance().getResendOtpUseCase().execute({ userId });
      setSeconds(RESEND_SECONDS);
      setAlert({
        type: 'success',
        title: 'Đã gửi lại',
        message: `Mã mới đã được gửi tới ${email ?? 'email của bạn'}`,
      });
    } catch (error) {
      setAlert({
        type: 'error',
        title: 'Không gửi được',
        message: error instanceof Error ? error.message : 'Vui lòng thử lại',
      });
    }
  };

  const mmss = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(
    seconds % 60,
  ).padStart(2, '0')}`;

  return (
    <OnboardingScreen showBack>
      <View className="flex-1 px-6 pt-2 pb-8">
        <View className="items-center mt-6">
          <View className="w-16 h-16 rounded-pill bg-surface-alt items-center justify-center">
            <Icon name="mail" size={34} color="#D4537E" />
          </View>
          <Text className="font-serif text-display-md text-text mt-6 text-center">
            Xác thực email
          </Text>
          <Text className="text-body-md text-text-muted mt-3 text-center px-2">
            Nhập mã 6 số đã gửi tới {email ?? 'email của bạn'}
          </Text>
        </View>

        {alert && (
          <View className="mt-4">
            <Alert {...alert} onClose={() => setAlert(null)} />
          </View>
        )}

        {/* OTP boxes — ô fill có pop animation + ô đang chờ được làm nổi */}
        <View className="items-center mt-6">
          <OtpInput value={code} onChange={onChange} length={OTP_LENGTH} autoFocus />
        </View>

        {/* Resend */}
        <View className="items-center mt-5">
          {seconds > 0 ? (
            <Text className="text-body-sm text-text-muted">Gửi lại mã sau {mmss}</Text>
          ) : (
            <TouchableOpacity onPress={resend}>
              <Text className="text-body-sm text-accent font-medium">Gửi lại mã</Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="mt-6">
          <Button
            label="Xác nhận"
            fullWidth
            size="lg"
            loading={loading}
            disabled={code.length !== OTP_LENGTH}
            onPress={() => handleVerify(code)}
          />
        </View>
      </View>
    </OnboardingScreen>
  );
}
