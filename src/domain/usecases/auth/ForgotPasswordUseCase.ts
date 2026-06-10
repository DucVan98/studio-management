import type { UseCase } from '../UseCase';
import type { IAuthRepository } from '../../repositories/IAuthRepository';

/** Luôn thành công dù email không tồn tại (server chống email enumeration). */
export class ForgotPasswordUseCase implements UseCase<string, void> {
  constructor(private readonly authRepository: IAuthRepository) {}

  execute(email: string): Promise<void> {
    return this.authRepository.forgotPassword(email);
  }
}
