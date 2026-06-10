import type { NavigatorScreenParams } from '@react-navigation/native';

/** Tabs trong khu vực đã đăng nhập. */
export type AppTabParamList = {
  Home: undefined;
  Memories: undefined;
  Explore: undefined;
  Profile: undefined;
};

/** Root stack — toàn bộ luồng auth + onboarding + khu vực app. */
export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  VerifyEmail: { userId: string; email?: string };
  ProfileSetup: undefined;
  StartDate: undefined;
  Invite: undefined;
  PartnerAccept: { code: string; inviterName?: string };
  Connected: { partnerName?: string; startDate?: string };
  App: NavigatorScreenParams<AppTabParamList> | undefined;
};

// Cho phép useNavigation()/useRoute() suy luận type mà không cần generic thủ công.
declare global {
   
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
