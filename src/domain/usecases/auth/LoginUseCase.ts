import type { UseCase } from '../UseCase';
import type { IAuthRepository, LoginParams } from '../../repositories/IAuthRepository';
import type { ISessionManager } from '../../repositories/ISessionManager';
import type { AuthSession } from '../../entities';

export class LoginUseCase implements UseCase<LoginParams, AuthSession> {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly session: ISessionManager,
  ) {}

  async execute(params: LoginParams): Promise<AuthSession> {
    const result = await this.authRepository.login(params);
    await this.session.start(result.tokens);
    return result;
  }
}
