import type { UseCase } from '../UseCase';
import type { ICoupleRepository } from '../../repositories/ICoupleRepository';
import type { CoupleStats } from '../../entities';

export class GetCoupleStatsUseCase implements UseCase<void, CoupleStats> {
  constructor(private readonly coupleRepository: ICoupleRepository) {}

  execute(): Promise<CoupleStats> {
    return this.coupleRepository.getStats();
  }
}
