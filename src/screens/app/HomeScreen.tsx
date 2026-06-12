import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useValue } from '@legendapp/state/react';
import { authStore$ } from '../../stores/auth.store';

export function HomeScreen() {
  const { t, i18n } = useTranslation();
  const user = useValue(authStore$.user);
  // Locale của date phải khớp ngôn ngữ i18n đang dùng (tránh trộn EN/VI)
  const dateLocale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';

  // Mock data – replace với real data từ store/API
  const quickActions = [
    {
      id: '1',
      icon: '📊',
      title: t('home.quickActions.overview'),
      subtitle: t('home.quickActions.overviewSubtitle'),
      bg: '#FCE7EE',
    },
    {
      id: '2',
      icon: '📝',
      title: t('home.quickActions.tasks'),
      subtitle: t('home.quickActions.tasksSubtitle', { count: 3 }),
      bg: '#FCE7EE',
    },
    {
      id: '3',
      icon: '🔔',
      title: t('home.quickActions.notifications'),
      subtitle: t('home.quickActions.notificationsSubtitle', { count: 2 }),
      bg: '#FCE7EE',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <ScrollView className="flex-1" contentContainerClassName="p-6">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-body-sm text-text-muted font-medium">
            {new Date().toLocaleDateString(dateLocale, {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </Text>
          <Text className="text-heading-xl font-bold text-text mt-1">
            {t('home.welcome', { name: user?.name ?? t('home.defaultName') })}
          </Text>
          <Text className="text-body-md text-text-muted mt-1">
            {t('home.greeting')}
          </Text>
        </View>

        {/* Quick action cards – placeholder để map từ Figma */}
        <View className="gap-4">
          {quickActions.map(action => (
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
                  <Text className="text-body-md font-semibold text-text">
                    {action.title}
                  </Text>
                  <Text className="text-body-sm text-text-muted mt-0.5">
                    {action.subtitle}
                  </Text>
                </View>
                <Text className="text-text-muted">›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
