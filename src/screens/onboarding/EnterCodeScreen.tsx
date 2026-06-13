import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DIContainer } from '../../di/DIContainer';
import { Button, Input, Icon, Alert } from '../../components/ui';
import { OnboardingScreen } from '../../components/onboarding';

/**
 * Màn nhập mã mời thủ công — dành cho user2 vừa cài app và có sẵn mã invite
 * từ người yêu (qua tin nhắn, chat, v.v.).
 *
 * Luồng: Invite → EnterCode → PartnerAccept → Connected
 */
export function EnterCodeScreen() {
  const navigation = useNavigation();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleNext = async () => {
    const trimmed = code.trim().toUpperCase();
    setErrorMsg(null);
    if (!trimmed) {
      setErrorMsg('Vui lòng nhập mã mời');
      return;
    }

    setLoading(true);
    try {
      const invite = await DIContainer.getInstance().getGetInviteUseCase().execute(trimmed);
      navigation.navigate('PartnerAccept', { code: trimmed, inviterName: invite.inviterName });
    } catch {
      setErrorMsg('Mã mời không tồn tại hoặc đã hết hạn');
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
        <View className="flex-1 px-6 pt-4 pb-8">
          <View className="items-center mt-6">
            <View className="w-16 h-16 rounded-pill bg-surface-alt items-center justify-center">
              <Icon name="heart" size={34} color="#D4537E" />
            </View>
            <Text className="font-serif text-display-md text-text mt-6 text-center">
              Nhập mã mời
            </Text>
            <Text className="text-body-md text-text-muted mt-3 text-center px-2">
              Nhập mã mời bạn nhận được từ người ấy để kết nối
            </Text>
          </View>

          {errorMsg && (
            <View className="mt-4">
              <Alert type="error" title={errorMsg} onClose={() => setErrorMsg(null)} />
            </View>
          )}

          <View className="mt-6">
            <Input
              label="Mã mời"
              placeholder="VD: ABC123"
              value={code}
              onChangeText={(t) => setCode(t.toUpperCase())}
              autoCapitalize="characters"
              autoCorrect={false}
              autoFocus
              returnKeyType="go"
              onSubmitEditing={handleNext}
            />
          </View>

          <View className="flex-1" />

          <Button
            label="Tiếp tục"
            fullWidth
            size="lg"
            loading={loading}
            disabled={!code.trim()}
            onPress={handleNext}
          />
          <TouchableOpacity
            className="items-center mt-5"
            onPress={() => navigation.goBack()}
          >
            <Text className="text-body-md text-text-muted">Quay lại</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </OnboardingScreen>
  );
}
