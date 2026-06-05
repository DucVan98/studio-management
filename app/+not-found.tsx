import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotFoundScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background items-center justify-center p-6">
      <Text className="text-6xl mb-6">🔍</Text>
      <Text className="text-heading-xl font-bold text-secondary-900 text-center">
        Trang không tìm thấy
      </Text>
      <Text className="text-body-md text-secondary-500 text-center mt-3">
        URL này không tồn tại trong ứng dụng.
      </Text>
      <Link href="/" asChild>
        <TouchableOpacity className="mt-8 h-12 px-8 rounded-xl bg-primary-500 items-center justify-center">
          <Text className="text-white font-bold text-body-md">Về trang chủ</Text>
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
}
