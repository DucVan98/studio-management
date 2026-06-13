import type {
  ForgotPasswordResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
  ResendOtpRequestDto,
  ResetPasswordRequestDto,
  TokenPairDto,
  VerifyEmailRequestDto,
} from '../types/api.types';

export interface IAuthDataSource {
  register(body: RegisterRequestDto): Promise<RegisterResponseDto>;
  verifyEmail(body: VerifyEmailRequestDto): Promise<TokenPairDto>;
  resendOtp(body: ResendOtpRequestDto): Promise<void>;
  login(email: string, password: string): Promise<TokenPairDto>;
  refresh(refreshToken: string): Promise<TokenPairDto>;
  forgotPassword(email: string): Promise<ForgotPasswordResponseDto>;
  resetPassword(body: ResetPasswordRequestDto): Promise<void>;
  logout(refreshToken: string): Promise<void>;
}
