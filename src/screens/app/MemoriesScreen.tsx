import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Screen } from '../../components/ui';

export function MemoriesScreen() {
  const { t } = useTranslation();
  return (
    <Screen>
      <View className="flex-1 items-center justify-center">
        <Text className="text-heading-lg font-bold text-text">{t('tabs.memories')}</Text>
        <Text className="text-body-md text-text-muted mt-2">{t('common.comingSoon')}</Text>
      </View>
    </Screen>
  );
}
