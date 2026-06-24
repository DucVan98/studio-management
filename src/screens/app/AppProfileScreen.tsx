import { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useValue } from '@legendapp/state/react';
import { useNavigation } from '@react-navigation/native';
import { authStore$, authActions } from '../../stores/auth.store';
import { appStore$, appActions } from '../../stores/app.store';
import { onboardingActions } from '../../stores/onboarding.store';
import { useLogout } from '../../queries/hooks/auth.queries';
import { AnimatedToggle, ConfirmModal, Screen } from '../../components/ui';

/** Một hàng cài đặt có công tắc animated. */
function SettingToggleRow({
  label,
  value,
  onValueChange,
  divider,
}: {
  label: string;
  value: boolean;
  onValueChange: (next: boolean) => void;
  divider?: boolean;
}) {
  return (
    <View className={`flex-row items-center px-5 py-4 ${divider ? 'border-b border-border' : ''}`}>
      <Text className="flex-1 text-body-md font-medium text-text">{label}</Text>
      <AnimatedToggle value={value} onValueChange={onValueChange} />
    </View>
  );
}

export function AppProfileScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const user = useValue(authStore$.user);
  const theme = useValue(appStore$.theme);
  const isDark = theme === 'midnight-gold';
  const [pushOn, setPushOn] = useState(true);
  const [reminderOn, setReminderOn] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const logout = useLogout();

  // Chế độ tối nối thẳng theme store → đổi giao diện thật ngay lập tức.
  const toggleDark = (next: boolean) => appActions.setTheme(next ? 'midnight-gold' : 'rose-romantic');

  const menuItems = [
    { id: '1', icon: '✏️', label: t('profile.editProfile') },
    { id: '2', icon: '🔔', label: t('profile.notifications') },
    { id: '3', icon: '🌐', label: t('profile.language') },
    { id: '4', icon: '🎨', label: t('profile.theme') },
    { id: '5', icon: 'ℹ️', label: t('profile.about') },
  ];

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    // Logout thật: LogoutUseCase clear secure session (refresh token) — best-effort
    // gọi server, nhưng LUÔN xoá session local. Nếu chỉ clear store in-memory,
    // token vẫn nằm trong SecureStore nên lần mở app sau restore() lại "đăng nhập".
    logout.mutate(undefined);
    authActions.logout();
    // Xoá onboarding đã persist trong MMKV — nếu không, relationshipStartDate cũ
    // còn sót khiến lần đăng nhập sau bị đẩy nhầm vào màn Invite.
    onboardingActions.reset();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <Screen>
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

        {/* Cài đặt nhanh — công tắc animated */}
        <Text className="text-body-sm font-semibold text-text-muted mt-6 mb-2 px-1">
          {t('settings.quickSettings')}
        </Text>
        <View className="bg-surface rounded-2xl overflow-hidden shadow-sm">
          <SettingToggleRow label={t('settings.darkMode')} value={isDark} onValueChange={toggleDark} divider />
          <SettingToggleRow label={t('settings.pushNotifications')} value={pushOn} onValueChange={setPushOn} divider />
          <SettingToggleRow label={t('settings.memoryReminders')} value={reminderOn} onValueChange={setReminderOn} />
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
    </Screen>
  );
}
