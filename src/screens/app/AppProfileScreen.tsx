import { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useValue } from '@legendapp/state/react';
import { useNavigation } from '@react-navigation/native';
import { authStore$, authActions } from '../../stores/auth.store';
import { ConfirmModal } from '../../components/ui';

export function AppProfileScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const user = useValue(authStore$.user);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    { id: '1', icon: '✏️', label: t('profile.editProfile') },
    { id: '2', icon: '🔔', label: t('profile.notifications') },
    { id: '3', icon: '🌐', label: t('profile.language') },
    { id: '4', icon: '🎨', label: t('profile.theme') },
    { id: '5', icon: 'ℹ️', label: t('profile.about') },
  ];

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    authActions.logout();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
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
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              className={`flex-row items-center px-5 py-4 gap-4 ${
                index < menuItems.length - 1 ? 'border-b border-border' : ''
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

        {/* Nút đăng xuất — mở ConfirmModal thay vì OS Alert */}
        <TouchableOpacity
          className="mt-6 h-12 rounded-xl bg-error/10 items-center justify-center"
          onPress={() => setShowLogoutModal(true)}
          activeOpacity={0.8}
        >
          <Text className="text-error font-semibold text-body-md">{t('auth.logout')}</Text>
        </TouchableOpacity>
      </View>

      {/* Modal xác nhận đăng xuất */}
      <ConfirmModal
        visible={showLogoutModal}
        iconName="x"
        iconType="error"
        title={t('auth.logout')}
        message={t('profile.logoutConfirm')}
        confirmLabel={t('auth.logout')}
        confirmVariant="danger"
        cancelLabel={t('common.cancel')}
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutModal(false)}
      />
    </SafeAreaView>
  );
}
