import type { UseCase } from '../UseCase';
import type {
  IAuthRepository,
  ResetPasswordParams,
} from '../../repositories/IAuthRepository';
import { AppError } from '../../errors/AppError';

export class ResetPasswordUseCase implements UseCase<ResetPasswordParams, void> {
  constructor(private readonly authRepository: IAuthRepository) {}

  execute(params: ResetPasswordParams): Promise<void> {
    if (params.newPassword.length < 8 || params.newPassword.length > 72) {
      throw new AppError('Password must be 8–72 characters', 'validation');
    }
    if (!/^\d{6}$/.test(params.code)) {
      throw new AppError('OTP code must be 6 digits', 'validation');
    }
    return this.authRepository.resetPassword(params);
  }
}
