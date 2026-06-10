import type { IAuthDataSource } from '../datasources/IAuthDataSource';
import type {
  IAuthRepository,
  LoginParams,
  RegisterParams,
  ResetPasswordParams,
  VerifyEmailParams,
} from '../../domain/repositories/IAuthRepository';
import type { AuthSession, RegistrationResult } from '../../domain/entities';
import { mapAuthSession } from '../mappers/UserMapper';
import { guard } from '../mappers/ErrorMapper';

export class HttpAuthRepository implements IAuthRepository {
  constructor(private readonly dataSource: IAuthDataSource) {}

  register(params: RegisterParams): Promise<RegistrationResult> {
    return guard(async () => {
      const dto = await this.dataSource.register({
        email: params.email,
        password: params.password,
        name: params.name,
      });
      return { userId: dto.user_id, message: dto.message };
    });
  }

  verifyEmail(params: VerifyEmailParams): Promise<AuthSession> {
    return guard(async () =>
      mapAuthSession(
        await this.dataSource.verifyEmail({ user_id: params.userId, code: params.code }),
      ),
    );
  }

  login(params: LoginParams): Promise<AuthSession> {
    return guard(async () =>
      mapAuthSession(await this.dataSource.login(params.email, params.password)),
    );
  }

  refresh(refreshToken: string): Promise<AuthSession> {
    return guard(async () => mapAuthSession(await this.dataSource.refresh(refreshToken)));
  }

  forgotPassword(email: string): Promise<void> {
    return guard(async () => {
      await this.dataSource.forgotPassword(email);
    });
  }

  resetPassword(params: ResetPasswordParams): Promise<void> {
    return guard(() =>
      this.dataSource.resetPassword({
        user_id: params.userId,
        code: params.code,
        new_password: params.newPassword,
      }),
    );
  }

  logout(refreshToken: string): Promise<void> {
    return guard(() => this.dataSource.logout(refreshToken));
  }
}
