import type { LoginCredentials, AuthTokens } from '../../domain/repositories/IAuthRepository';

export interface AuthLoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    created_at: string;
    updated_at: string;
  };
  access_token: string;
  refresh_token?: string;
}

export interface IAuthDataSource {
  login(credentials: LoginCredentials): Promise<AuthLoginResponse>;
  logout(): Promise<void>;
  refreshToken(token: string): Promise<{ access_token: string; refresh_token?: string }>;
  getProfile(): Promise<AuthLoginResponse['user']>;
}
