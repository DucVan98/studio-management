import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { DIContainer } from '../../src/di/DIContainer';
import { authActions } from '../../src/stores/auth.store';

export default function LoginScreen() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(t('common.error'), t('auth.loginError'));
      return;
    }

    setLoading(true);
    try {
      const container = DIContainer.getInstance();
      const loginUseCase = container.getLoginUseCase();

      const { user, tokens } = await loginUseCase.execute({ email, password });

      // Cập nhật store
      authActions.login(
        { id: user.id, email: user.email, name: user.name, avatar: user.avatar },
        tokens.accessToken,
      );

      // Set auth token trên HTTP client
      container['http'].setAuthToken(tokens.accessToken);

      router.replace('/(app)');
    } catch (error) {
      Alert.alert(
        t('common.error'),
        error instanceof Error ? error.message : t('auth.loginError'),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-surface"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow justify-center px-6 py-12"
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo / Header */}
        <View className="items-center mb-10">
          <View className="w-20 h-20 rounded-2xl bg-primary-500 items-center justify-center mb-4">
            <Text className="text-white text-3xl font-bold">A</Text>
          </View>
          <Text className="text-heading-xl font-bold text-secondary-900">
            {t('auth.login')}
          </Text>
          <Text className="text-body-md text-secondary-500 mt-1">
            Chào mừng bạn trở lại
          </Text>
        </View>

        {/* Form */}
        <View className="gap-4">
          {/* Email */}
          <View>
            <Text className="text-body-sm font-medium text-secondary-700 mb-1.5">
              {t('auth.email')}
            </Text>
            <TextInput
              className="w-full h-12 px-4 rounded-xl border border-secondary-200 bg-surface text-body-md text-secondary-900"
              placeholder={t('auth.emailPlaceholder')}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              placeholderTextColor="#94a3b8"
            />
          </View>

          {/* Password */}
          <View>
            <Text className="text-body-sm font-medium text-secondary-700 mb-1.5">
              {t('auth.password')}
            </Text>
            <TextInput
              className="w-full h-12 px-4 rounded-xl border border-secondary-200 bg-surface text-body-md text-secondary-900"
              placeholder={t('auth.passwordPlaceholder')}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="current-password"
              placeholderTextColor="#94a3b8"
            />
          </View>

          {/* Forgot password */}
          <TouchableOpacity className="self-end">
            <Text className="text-body-sm text-primary-600 font-medium">
              {t('auth.forgotPassword')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Login button */}
        <TouchableOpacity
          className={`mt-8 h-12 rounded-xl items-center justify-center ${
            loading ? 'bg-primary-300' : 'bg-primary-500'
          }`}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold text-body-lg">
            {loading ? t('common.loading') : t('auth.loginButton')}
          </Text>
        </TouchableOpacity>

        {/* Register link */}
        <TouchableOpacity
          className="mt-6 items-center"
          onPress={() => router.push('/auth/register')}
        >
          <Text className="text-body-md text-secondary-500">
            {t('auth.registerLink')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
