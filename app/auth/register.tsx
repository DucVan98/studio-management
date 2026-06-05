import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function RegisterScreen() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
        {/* Header */}
        <View className="items-center mb-10">
          <Text className="text-heading-xl font-bold text-secondary-900">
            {t('auth.register')}
          </Text>
          <Text className="text-body-md text-secondary-500 mt-1">
            Tạo tài khoản mới
          </Text>
        </View>

        {/* Form */}
        <View className="gap-4">
          <View>
            <Text className="text-body-sm font-medium text-secondary-700 mb-1.5">
              Họ và tên
            </Text>
            <TextInput
              className="w-full h-12 px-4 rounded-xl border border-secondary-200 bg-surface text-body-md text-secondary-900"
              placeholder="Nhập họ và tên"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#94a3b8"
            />
          </View>

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
              placeholderTextColor="#94a3b8"
            />
          </View>

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
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <TouchableOpacity
          className="mt-8 h-12 rounded-xl bg-primary-500 items-center justify-center"
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold text-body-lg">
            {t('auth.register')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-6 items-center"
          onPress={() => router.back()}
        >
          <Text className="text-body-md text-secondary-500">
            {t('auth.loginLink')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
