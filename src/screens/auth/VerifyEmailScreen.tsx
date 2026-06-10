import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { DIContainer } from '../../di/DIContainer';
import { authActions } from '../../stores/auth.store';
import { Button, Icon } from '../../components/ui';
import { OnboardingScreen } from '../../components/onboarding';
import type { RootStackParamList } from '../../navigation/types';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 45;

/** Màn Xác thực email — OTP 6 số (Figma 176:981). */
export function VerifyEmailScreen() {
  const navigation = useNavigation();
  const { userId, email } = useRoute<RouteProp<RootStackParamList, 'VerifyEmail'>>().params;
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  const handleVerify = async (value: string) => {
    if (!userId) {
      Alert.alert('Có lỗi xảy ra', 'Thiếu thông tin tài khoản, vui lòng đăng ký lại');
      return;
    }
    setLoading(true);
    try {
      const useCase = DIContainer.getInstance().getVerifyEmailUseCase();
      const { user, tokens } = await useCase.execute({ userId, code: value });

      // verify-email thành công ⇒ đã login (session.start gọi trong usecase).
      authActions.login(
        { id: user.id, email: user.email, name: user.name, avatar: user.avatarUrl },
        tokens.accessToken,
      );
      navigation.reset({ index: 0, routes: [{ name: 'ProfileSetup' }] });
    } catch (error) {
      setCode('');
      Alert.alert(
        'Có lỗi xảy ra',
        error instanceof Error ? error.message : 'Mã xác thực không đúng',
      );
    } finally {
      setLoading(false);
    }
  };

  const onChange = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, OTP_LENGTH);
    setCode(digits);
    if (digits.length === OTP_LENGTH) handleVerify(digits);
  };

  const resend = () => {
    // TODO: ghép API gửi lại OTP khi backend sẵn sàng.
    setSeconds(RESEND_SECONDS);
    Alert.alert('Đã gửi lại', `Mã mới đã được gửi tới ${email ?? 'email của bạn'}`);
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

        {/* OTP boxes – 1 TextInput ẩn điều khiển 6 ô hiển thị */}
        <Pressable
          className="flex-row justify-center gap-2 mt-8"
          onPress={() => inputRef.current?.focus()}
        >
          {Array.from({ length: OTP_LENGTH }).map((_, i) => {
            const filled = i < code.length;
            const active = i === code.length;
            return (
              <View
                key={i}
                className={`w-12 h-14 rounded-md border items-center justify-center bg-surface ${
                  active ? 'border-accent' : 'border-border'
                }`}
              >
                <Text className="text-heading-lg font-bold text-text">
                  {filled ? code[i] : ''}
                </Text>
              </View>
            );
          })}
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
