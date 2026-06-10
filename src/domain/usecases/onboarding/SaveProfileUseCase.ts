import type { UseCase } from '../UseCase';
import type { IOnboardingRepository } from '../../repositories/IOnboardingRepository';
import type { OnboardingProfile } from '../../entities/Onboarding.entity';
import { AppError } from '../../errors/AppError';

export interface SaveProfileInput {
  name: string;
  avatarColor?: string;
}

export class SaveProfileUseCase implements UseCase<SaveProfileInput, OnboardingProfile> {
  constructor(private readonly repo: IOnboardingRepository) {}

  async execute(input: SaveProfileInput): Promise<OnboardingProfile> {
    const name = input.name.trim();
    if (!name) throw new AppError('Tên không được để trống', 'validation');
    if (name.length < 2) throw new AppError('Tên phải có ít nhất 2 ký tự', 'validation');
    if (name.length > 50) throw new AppError('Tên không được quá 50 ký tự', 'validation');

    const profile: OnboardingProfile = { name, avatarColor: input.avatarColor };
    await this.repo.saveProfile(profile);
    return profile;
  }
}
