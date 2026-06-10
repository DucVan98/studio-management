import type { HttpClient } from '../../http';
import type { IAuthDataSource } from './IAuthDataSource';
import type {
  ForgotPasswordResponseDto,
  LoginRequestDto,
  RefreshRequestDto,
  RegisterRequestDto,
  RegisterResponseDto,
  ResetPasswordRequestDto,
  TokenPairDto,
  VerifyEmailRequestDto,
} from '../types/api.types';

export class HttpAuthDataSource implements IAuthDataSource {
  constructor(private readonly http: HttpClient) {}

  async register(body: RegisterRequestDto): Promise<RegisterResponseDto> {
    const res = await this.http.post<RegisterResponseDto, RegisterRequestDto>(
      '/auth/register',
      body,
    );
    return res.data;
  }

  async verifyEmail(body: VerifyEmailRequestDto): Promise<TokenPairDto> {
    const res = await this.http.post<TokenPairDto, VerifyEmailRequestDto>(
      '/auth/verify-email',
      body,
    );
    return res.data;
  }

  async login(email: string, password: string): Promise<TokenPairDto> {
    const res = await this.http.post<TokenPairDto, LoginRequestDto>('/auth/login', {
      email,
      password,
    });
    return res.data;
  }

  async refresh(refreshToken: string): Promise<TokenPairDto> {
    const res = await this.http.post<TokenPairDto, RefreshRequestDto>('/auth/refresh', {
      refresh_token: refreshToken,
    });
    return res.data;
  }

  async forgotPassword(email: string): Promise<ForgotPasswordResponseDto> {
    const res = await this.http.post<ForgotPasswordResponseDto>('/auth/forgot-password', {
      email,
    });
    return res.data;
  }

  async resetPassword(body: ResetPasswordRequestDto): Promise<void> {
    await this.http.post<void, ResetPasswordRequestDto>('/auth/reset-password', body);
  }

  /** Refresh token gửi qua header X-Refresh-Token, KHÔNG nằm trong body. */
  async logout(refreshToken: string): Promise<void> {
    await this.http.post<void>('/auth/logout', undefined, {
      headers: { 'X-Refresh-Token': refreshToken },
    });
  }
}
