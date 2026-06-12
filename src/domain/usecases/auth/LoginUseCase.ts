import type { UseCase } from '../UseCase';
import type { IAuthRepository, LoginParams } from '../../repositories/IAuthRepository';
import type { ISessionManager } from '../../repositories/ISessionManager';
import type { AuthSession } from '../../entities';
import { AppError } from '../../errors/AppError';
import { validateEmail } from './validateEmail';

export class LoginUseCase implements UseCase<LoginParams, AuthSession> {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly session: ISessionManager,
  ) {}

  async execute(params: LoginParams): Promise<AuthSession> {
    const email = validateEmail(params.email);
    if (params.password.length === 0) {
      throw new AppError('Password is required', 'validation');
    }
    const result = await this.authRepository.login({ ...params, email });
    await this.session.start(result.tokens);
    return result;
  }
}
