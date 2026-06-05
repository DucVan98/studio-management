import type { IAuthDataSource } from '../datasources/IAuthDataSource';
import type {
  IAuthRepository,
  LoginCredentials,
  AuthTokens,
} from '../../domain/repositories/IAuthRepository';
import type { UserEntity } from '../../domain/entities/User.entity';
import { mapUserFromApi } from '../mappers/UserMapper';

export class HttpAuthRepository implements IAuthRepository {
  constructor(private readonly dataSource: IAuthDataSource) {}

  async login(
    credentials: LoginCredentials,
  ): Promise<{ user: UserEntity; tokens: AuthTokens }> {
    const response = await this.dataSource.login(credentials);
    return {
      user: mapUserFromApi(response.user),
      tokens: {
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
      },
    };
  }

  async logout(): Promise<void> {
    return this.dataSource.logout();
  }

  async refreshToken(token: string): Promise<AuthTokens> {
    const response = await this.dataSource.refreshToken(token);
    return {
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
    };
  }

  async getProfile(): Promise<UserEntity> {
    const raw = await this.dataSource.getProfile();
    return mapUserFromApi(raw);
  }
}
