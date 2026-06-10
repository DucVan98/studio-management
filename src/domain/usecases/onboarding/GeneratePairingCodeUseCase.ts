import type { UseCase } from '../UseCase';
import type { IOnboardingRepository } from '../../repositories/IOnboardingRepository';
import type { PairingCode } from '../../entities/Onboarding.entity';

export class GeneratePairingCodeUseCase implements UseCase<void, PairingCode> {
  constructor(private readonly repo: IOnboardingRepository) {}

  async execute(): Promise<PairingCode> {
    return this.repo.generatePairingCode();
  }
}
