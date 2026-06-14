import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { VerifyEmailScreen } from '../screens/auth/VerifyEmailScreen';
import { ProfileSetupScreen } from '../screens/onboarding/ProfileSetupScreen';
import { StartDateScreen } from '../screens/onboarding/StartDateScreen';
import { InviteScreen } from '../screens/onboarding/InviteScreen';
import { EnterCodeScreen } from '../screens/onboarding/EnterCodeScreen';
import { PartnerAcceptScreen } from '../screens/onboarding/PartnerAcceptScreen';
import { ConnectedScreen } from '../screens/onboarding/ConnectedScreen';
import { AppTabs } from './AppTabs';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator({ initialRouteName }: { initialRouteName: keyof RootStackParamList }) {
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <Stack.Screen name="StartDate" component={StartDateScreen} />
      <Stack.Screen name="Invite" component={InviteScreen} />
      <Stack.Screen name="EnterCode" component={EnterCodeScreen} />
      <Stack.Screen name="PartnerAccept" component={PartnerAcceptScreen} />
      <Stack.Screen name="Connected" component={ConnectedScreen} />
      {/* Vào main app bằng fade — tránh hiệu ứng trượt gây cảm giác nội
          dung "chạy" khi reset từ onboarding/boot sang Home */}
      <Stack.Screen name="App" component={AppTabs} options={{ animation: 'fade' }} />
    </Stack.Navigator>
  );
}
