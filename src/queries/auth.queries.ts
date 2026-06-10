import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DIContainer } from '../di/DIContainer';
import type {
  LoginParams,
  RegisterParams,
  ResetPasswordParams,
  VerifyEmailParams,
} from '../domain/repositories/IAuthRepository';
import type { LogoutParams } from '../domain/usecases/auth/LogoutUseCase';

const di = () => DIContainer.getInstance();

/** Login — token được AuthSessionService tự lưu vào SecureStore. */
export function useLogin() {
  return useMutation({
    mutationFn: (params: LoginParams) => di().getLoginUseCase().execute(params),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (params: RegisterParams) => di().getRegisterUseCase().execute(params),
  });
}

/** Verify OTP — thành công thì login luôn. */
export function useVerifyEmail() {
  return useMutation({
    mutationFn: (params: VerifyEmailParams) =>
      di().getVerifyEmailUseCase().execute(params),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => di().getForgotPasswordUseCase().execute(email),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (params: ResetPasswordParams) =>
      di().getResetPasswordUseCase().execute(params),
  });
}

/** Logout — clear toàn bộ cache để không lộ data sang account khác. */
export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params?: LogoutParams) => di().getLogoutUseCase().execute(params),
    onSettled: () => {
      queryClient.clear();
    },
  });
}
