import type { ReactNode } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '../ui/Icon';

/**
 * Các thành phần dùng chung cho luồng Onboarding (khớp Figma "Onboarding Flow").
 * Nền bg-bg, heading serif màu text, accent pill button.
 */

/** Khung màn hình onboarding: SafeArea + nền bg + nút back tùy chọn. */
export function OnboardingScreen({
  children,
  showBack = false,
  onBack,
}: {
  children: ReactNode;
  showBack?: boolean;
  onBack?: () => void;
}) {
  const navigation = useNavigation();
  return (
    <SafeAreaView className="flex-1 bg-bg">
      {showBack && (
        <View className="px-6 pt-2">
          <TouchableOpacity
            onPress={onBack ?? (() => navigation.goBack())}
            hitSlop={12}
            className="w-10 h-10 items-center justify-center -ml-2"
          >
            <Icon name="chevron-left" size="lg" color="#791F1F" />
          </TouchableOpacity>
        </View>
      )}
      {children}
    </SafeAreaView>
  );
}

/** Tiêu đề serif + phụ đề. */
export function OnboardingHeading({
  title,
  subtitle,
  center = false,
}: {
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <View className={center ? 'items-center' : undefined}>
      <Text
        className={`font-serif text-display-md text-text ${center ? 'text-center' : ''}`}
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          className={`text-body-md text-text-muted mt-2 ${center ? 'text-center' : ''}`}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
}

/** Dải phân cách "hoặc". */
export function OrDivider({ label = 'hoặc' }: { label?: string }) {
  return (
    <View className="flex-row items-center my-5">
      <View className="flex-1 h-px bg-border" />
      <Text className="mx-3 text-body-sm text-text-muted">{label}</Text>
      <View className="flex-1 h-px bg-border" />
    </View>
  );
}

/** Nút đăng nhập mạng xã hội Apple + Google (UI, chưa ghép SSO). */
export function SocialAuthButtons({
  onApple,
  onGoogle,
}: {
  onApple?: () => void;
  onGoogle?: () => void;
}) {
  return (
    <View className="gap-3">
      <TouchableOpacity
        onPress={onApple}
        activeOpacity={0.85}
        className="h-12 rounded-pill bg-black flex-row items-center justify-center gap-2"
      >
        <Text className="text-white text-body-md font-medium">
          {Platform.OS === 'ios' ? ' ' : ''}Tiếp tục với Apple
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onGoogle}
        activeOpacity={0.85}
        className="h-12 rounded-pill bg-surface border border-border flex-row items-center justify-center gap-2"
      >
        <Text className="text-body-md font-bold text-accent">G</Text>
        <Text className="text-body-md font-medium text-text">
          Tiếp tục với Google
        </Text>
      </TouchableOpacity>
    </View>
  );
}
