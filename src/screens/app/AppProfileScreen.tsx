import { View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useValue } from '@legendapp/state/react';
import { useNavigation } from '@react-navigation/native';
import { authStore$, authActions } from '../../stores/auth.store';

export function AppProfileScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const user = useValue(authStore$.user);

  const handleLogout = () => {
    Alert.alert(t('auth.logout'), t('profile.logoutConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('auth.logout'),
        style: 'destructive',
        onPress: () => {
          authActions.logout();
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <View className="flex-1 p-6">
        {/* Avatar + User info */}
        <View className="items-center py-8">
          <View className="w-24 h-24 rounded-full bg-surface-alt items-center justify-center mb-4">
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} className="w-24 h-24 rounded-full" />
            ) : (
              <Text className="text-4xl font-bold text-accent">
                {user?.name?.charAt(0).toUpperCase() ?? 'U'}
              </Text>
            )}
          </View>
          <Text className="text-heading-lg font-bold text-text">{user?.name ?? '—'}</Text>
          <Text className="text-body-md text-text-muted mt-1">{user?.email ?? '—'}</Text>
        </View>

        {/* Menu items */}
        <View className="bg-surface rounded-2xl overflow-hidden shadow-sm">
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              className={`flex-row items-center px-5 py-4 gap-4 ${
                index < MENU_ITEMS.length - 1 ? 'border-b border-border' : ''
              }`}
            >
              <Text className="text-2xl">{item.icon}</Text>
              <Text className="flex-1 text-body-md font-medium text-text">
                {item.label}
              </Text>
              <Text className="text-text-muted">›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity
          className="mt-6 h-12 rounded-xl bg-error/10 items-center justify-center"
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text className="text-error font-semibold text-body-md">{t('auth.logout')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const MENU_ITEMS = [
  { id: '1', icon: '✏️', label: 'Chỉnh sửa hồ sơ' },
  { id: '2', icon: '🔔', label: 'Thông báo' },
  { id: '3', icon: '🌐', label: 'Ngôn ngữ' },
  { id: '4', icon: '🎨', label: 'Giao diện' },
  { id: '5', icon: 'ℹ️', label: 'Về ứng dụng' },
];
