import type { UseCase } from '../UseCase';
import type { IMilestoneRepository } from '../../repositories/IMilestoneRepository';
import type { MilestoneList } from '../../entities';

export class GetMilestonesUseCase implements UseCase<void, MilestoneList> {
  constructor(private readonly milestoneRepository: IMilestoneRepository) {}

  execute(): Promise<MilestoneList> {
    return this.milestoneRepository.getMilestones();
  }
}
