import type { UseCase } from '../UseCase';
import type {
  IAuthRepository,
  VerifyEmailParams,
} from '../../repositories/IAuthRepository';
import type { ISessionManager } from '../../repositories/ISessionManager';
import type { AuthSession } from '../../entities';
import { AppError } from '../../errors/AppError';

/** Verify OTP email — thành công thì login luôn (lưu session). */
export class VerifyEmailUseCase implements UseCase<VerifyEmailParams, AuthSession> {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly session: ISessionManager,
  ) {}

  async execute(params: VerifyEmailParams): Promise<AuthSession> {
    if (!/^\d{6}$/.test(params.code)) {
      throw new AppError('OTP code must be 6 digits', 'validation');
    }
    const result = await this.authRepository.verifyEmail(params);
    await this.session.start(result.tokens);
    return result;
  }
}
