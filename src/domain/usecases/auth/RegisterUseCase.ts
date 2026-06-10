import type { UseCase } from '../UseCase';
import type {
  IAuthRepository,
  RegisterParams,
} from '../../repositories/IAuthRepository';
import type { RegistrationResult } from '../../entities';
import { AppError } from '../../errors/AppError';

/**
 * Đăng ký — KHÔNG trả token. Sau bước này user phải nhập OTP
 * (VerifyEmailUseCase) mới login được.
 */
export class RegisterUseCase implements UseCase<RegisterParams, RegistrationResult> {
  constructor(private readonly authRepository: IAuthRepository) {}

  execute(params: RegisterParams): Promise<RegistrationResult> {
    if (params.password.length < 8 || params.password.length > 72) {
      throw new AppError('Password must be 8–72 characters', 'validation');
    }
    const name = params.name.trim();
    if (name.length < 1 || name.length > 50) {
      throw new AppError('Name must be 1–50 characters', 'validation');
    }
    return this.authRepository.register({ ...params, name });
  }
}
