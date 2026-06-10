import { createMutation } from '../factory';

/**
 * Auth — toàn bộ là mutation, không cache.
 * Login/verify/logout đều clear() cache để không lộ data giữa các account.
 */

export const useRegister = createMutation(di => di.getRegisterUseCase());

export const useVerifyEmail = createMutation(di => di.getVerifyEmailUseCase(), {
  onSuccess: queryClient => queryClient.clear(),
});

export const useLogin = createMutation(di => di.getLoginUseCase(), {
  onSuccess: queryClient => queryClient.clear(),
});

export const useForgotPassword = createMutation(di => di.getForgotPasswordUseCase());

export const useResetPassword = createMutation(di => di.getResetPasswordUseCase());

export const useLogout = createMutation(di => di.getLogoutUseCase(), {
  onSuccess: queryClient => queryClient.clear(),
});
