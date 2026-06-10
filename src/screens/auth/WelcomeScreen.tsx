import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Icon } from '../../components/ui';
import { OnboardingScreen } from '../../components/onboarding';

/** Màn 1 · Welcome (Figma 74:180). */
export function WelcomeScreen() {
  const navigation = useNavigation();
  return (
    <OnboardingScreen>
      <View className="flex-1 px-6 pt-8 pb-8">
        {/* Logo tile + tên app */}
        <View className="items-center mt-4">
          <View className="w-20 h-20 rounded-3xl bg-accent items-center justify-center">
            <Icon name="heart" size={44} color="#FFFFFF" />
          </View>
          <Text className="font-serif text-display-lg text-text mt-6">Everly</Text>
          <Text className="text-body-md text-text-muted text-center mt-3 px-4">
            Không gian riêng cho hai người — lưu giữ kỷ niệm, đếm từng ngày yêu
          </Text>
        </View>

        {/* Hai avatar lồng nhau (trang trí) */}
        <View className="flex-1 items-center justify-center">
          <View className="flex-row items-center">
            <View className="w-28 h-28 rounded-pill bg-accent items-center justify-center">
              <Text className="font-serif text-display-md text-on-accent">L</Text>
            </View>
            <View className="w-28 h-28 rounded-pill bg-accent-2 items-center justify-center -ml-6 border-4 border-bg">
              <Text className="font-serif text-display-md text-on-accent">M</Text>
            </View>
          </View>
        </View>

        {/* CTA */}
        <Button
          label="Bắt đầu"
          fullWidth
          size="lg"
          onPress={() => navigation.navigate('Register')}
        />
        <View className="flex-row justify-center mt-5">
          <Text className="text-body-md text-text-muted">Đã có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text className="text-body-md text-accent font-medium">Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>
    </OnboardingScreen>
  );
}
