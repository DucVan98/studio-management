import type { UseCase } from '../UseCase';
import type { IOnboardingRepository } from '../../repositories/IOnboardingRepository';
import type { CoupleConnection } from '../../entities/Onboarding.entity';
import { AppError } from '../../errors/AppError';

export interface ConnectPartnerInput {
  code: string;
}

export class ConnectPartnerUseCase implements UseCase<ConnectPartnerInput, CoupleConnection> {
  constructor(private readonly repo: IOnboardingRepository) {}

  async execute(input: ConnectPartnerInput): Promise<CoupleConnection> {
    const code = input.code.trim().toUpperCase();
    if (!code) throw new AppError('Vui lòng nhập mã kết nối', 'validation');
    if (code.length !== 6) throw new AppError('Mã kết nối phải có đúng 6 ký tự', 'validation');
    if (!/^[A-Z0-9]{6}$/.test(code)) throw new AppError('Mã kết nối chỉ gồm chữ và số', 'validation');

    return this.repo.connectPartner(code);
  }
}
