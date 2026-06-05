import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useValue } from '@legendapp/state/react';
import { authStore$ } from '../../src/stores/auth.store';

export default function HomeScreen() {
  const { t } = useTranslation();
  const user = useValue(authStore$.user);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerClassName="p-6">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-body-sm text-secondary-500 font-medium">
            {new Date().toLocaleDateString('vi-VN', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </Text>
          <Text className="text-heading-xl font-bold text-secondary-900 mt-1">
            {t('home.welcome', { name: user?.name ?? 'Bạn' })}
          </Text>
          <Text className="text-body-md text-secondary-500 mt-1">
            {t('home.greeting')}
          </Text>
        </View>

        {/* Quick action cards – placeholder để map từ Figma */}
        <View className="gap-4">
          {QUICK_ACTIONS.map(action => (
            <TouchableOpacity
              key={action.id}
              activeOpacity={0.8}
              className="bg-surface rounded-2xl p-5 shadow-md"
            >
              <View className="flex-row items-center gap-4">
                <View
                  className="w-12 h-12 rounded-xl items-center justify-center"
                  style={{ backgroundColor: action.bg }}
                >
                  <Text className="text-2xl">{action.icon}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-body-md font-semibold text-secondary-900">
                    {action.title}
                  </Text>
                  <Text className="text-body-sm text-secondary-500 mt-0.5">
                    {action.subtitle}
                  </Text>
                </View>
                <Text className="text-secondary-400">›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Mock data – replace với real data từ store/API ────────────────────────────
const QUICK_ACTIONS = [
  {
    id: '1',
    icon: '📊',
    title: 'Tổng quan',
    subtitle: 'Xem số liệu hôm nay',
    bg: '#eff6ff',
  },
  {
    id: '2',
    icon: '📝',
    title: 'Tác vụ',
    subtitle: '3 việc cần hoàn thành',
    bg: '#f0fdf4',
  },
  {
    id: '3',
    icon: '🔔',
    title: 'Thông báo',
    subtitle: '2 thông báo mới',
    bg: '#fff7ed',
  },
];
