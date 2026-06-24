import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Pressable,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { DIContainer } from '../../di/DIContainer';
import { authActions } from '../../stores/auth.store';
import { Button, Icon, Alert } from '../../components/ui';
import type { AlertType } from '../../components/ui';
import { OnboardingScreen } from '../../components/onboarding';
import type { RootStackParamList } from '../../navigation/types';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 45;

type AlertState = { type: AlertType; title: string; message?: string };

/** Dãy ô OTP + TextInput ẩn phủ lên trên để nhận nhập liệu. */
function OtpBoxes({
  code, onChange, inputRef,
}: {
  code: string;
  onChange: (text: string) => void;
  inputRef: React.RefObject<TextInput | null>;
}) {
  return (
    <Pressable className="flex-row justify-center gap-2 mt-6" onPress={() => inputRef.current?.focus()}>
      {Array.from({ length: OTP_LENGTH }).map((_, i) => (
        <View
          key={i}
          className={`w-12 h-14 rounded-md border items-center justify-center bg-surface ${
            i === code.length ? 'border-accent' : 'border-border'
          }`}
        >
          <Text className="text-heading-lg font-bold text-text">{i < code.length ? code[i] : ''}</Text>
        </View>
      ))}
      <TextInput
        ref={inputRef}
        value={code}
        onChangeText={onChange}
        keyboardType="number-pad"
        maxLength={OTP_LENGTH}
        autoFocus
        className="absolute opacity-0 w-full h-14"
      />
    </Pressable>
  );
}

/** Màn Xác thực email — OTP 6 số (Figma 176:981). */
export function VerifyEmailScreen() {
  const navigation = useNavigation();
  const { userId, email } = useRoute<RouteProp<RootStackParamList, 'VerifyEmail'>>().params;
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [alert, setAlert] = useState<AlertState | null>(null);
  const inputRef = useRef<TextInput>(null);

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

        {/* OTP boxes */}
        <OtpBoxes code={code} onChange={onChange} inputRef={inputRef} />

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
