import type { UserEntity } from '../entities/User.entity';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<{ user: UserEntity; tokens: AuthTokens }>;
  logout(): Promise<void>;
  refreshToken(token: string): Promise<AuthTokens>;
  getProfile(): Promise<UserEntity>;
}
