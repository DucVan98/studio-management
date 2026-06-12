import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

export function ExploreScreen() {
  const { t } = useTranslation();
  return (
    <SafeAreaView className="flex-1 bg-bg">
      <View className="flex-1 items-center justify-center">
        <Text className="text-heading-lg font-bold text-text">{t('tabs.explore')}</Text>
        <Text className="text-body-md text-text-muted mt-2">{t('common.comingSoon')}</Text>
      </View>
    </SafeAreaView>
  );
}
