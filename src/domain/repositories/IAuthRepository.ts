import type { AuthSession, RegistrationResult } from '../entities';

export interface RegisterParams {
  email: string;
  password: string; // 8–72 chars
  name: string; // 1–50 chars
}

export interface VerifyEmailParams {
  userId: string;
  code: string; // OTP 6 số
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  userId: string;
  code: string;
  newPassword: string; // 8–72 chars
}

export interface IAuthRepository {
  /** POST /auth/register — không trả token, phải verify email trước */
  register(params: RegisterParams): Promise<RegistrationResult>;
  /** POST /auth/verify-email — thành công thì login luôn */
  verifyEmail(params: VerifyEmailParams): Promise<AuthSession>;
  /** POST /auth/login */
  login(params: LoginParams): Promise<AuthSession>;
  /** POST /auth/refresh — token cũ bị revoke (rotation) */
  refresh(refreshToken: string): Promise<AuthSession>;
  /** POST /auth/resend-otp — gửi lại mã xác thực email */
  resendOtp(userId: string): Promise<void>;
  /** POST /auth/forgot-password — luôn 200 (chống email enumeration) */
  forgotPassword(email: string): Promise<void>;
  /** POST /auth/reset-password */
  resetPassword(params: ResetPasswordParams): Promise<void>;
  /** POST /auth/logout — refresh token gửi qua header X-Refresh-Token */
  logout(refreshToken: string): Promise<void>;
}
