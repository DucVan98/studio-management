import { View, Text } from 'react-native';
import { Button } from '../../components/ui';

export function HomeScreen() {
  return (
    <View className="flex-1 bg-bg items-center justify-center px-6">
      <View className="items-center gap-4">
        <Text className="text-display-lg font-serif">Studio Management</Text>
        <Text className="text-body-md text-text-muted text-center">
          Project reset. Sẵn sàng xây dựng feature mới! 🚀
        </Text>
        <Button label="Get Started" size="lg" />
      </View>
    </View>
  );
}
