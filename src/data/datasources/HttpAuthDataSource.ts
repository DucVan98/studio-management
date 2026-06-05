import type { HttpClient } from '../../http';
import type { LoginCredentials } from '../../domain/repositories/IAuthRepository';
import type { AuthLoginResponse, IAuthDataSource } from './IAuthDataSource';

export class HttpAuthDataSource implements IAuthDataSource {
  constructor(private readonly http: HttpClient) {}

  async login(credentials: LoginCredentials): Promise<AuthLoginResponse> {
    const res = await this.http.post<AuthLoginResponse>('/auth/login', credentials);
    return res.data;
  }

  async logout(): Promise<void> {
    await this.http.post('/auth/logout');
  }

  async refreshToken(token: string) {
    const res = await this.http.post<{ access_token: string; refresh_token?: string }>(
      '/auth/refresh',
      { refresh_token: token },
    );
    return res.data;
  }

  async getProfile() {
    const res = await this.http.get<AuthLoginResponse['user']>('/auth/profile');
    return res.data;
  }
}
