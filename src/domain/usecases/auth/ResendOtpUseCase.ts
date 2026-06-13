import type { UseCase } from '../UseCase';
import type { IAuthRepository } from '../../repositories/IAuthRepository';
import { AppError } from '../../errors/AppError';

export interface ResendOtpInput {
  userId: string;
}

/** Gửi lại mã OTP xác thực email. */
export class ResendOtpUseCase implements UseCase<ResendOtpInput, void> {
  constructor(private readonly repo: IAuthRepository) {}

  async execute({ userId }: ResendOtpInput): Promise<void> {
    if (!userId) {
      throw new AppError('Thiếu thông tin người dùng', 'validation');
    }
    await this.repo.resendOtp(userId);
  }
}
