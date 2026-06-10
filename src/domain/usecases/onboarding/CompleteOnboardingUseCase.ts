import type { UseCase } from '../UseCase';
import type { IOnboardingRepository } from '../../repositories/IOnboardingRepository';
import type { OnboardingData } from '../../entities/Onboarding.entity';
import { AppError } from '../../errors/AppError';

export class CompleteOnboardingUseCase implements UseCase<OnboardingData, void> {
  constructor(private readonly repo: IOnboardingRepository) {}

  async execute(data: OnboardingData): Promise<void> {
    if (!data.profile?.name) {
      throw new AppError('Bạn chưa nhập tên. Vui lòng quay lại bước Hồ sơ.', 'validation');
    }
    if (!data.relationshipStartDate) {
      throw new AppError('Bạn chưa chọn ngày bắt đầu. Vui lòng quay lại.', 'validation');
    }
    await this.repo.completeOnboarding();
  }
}
