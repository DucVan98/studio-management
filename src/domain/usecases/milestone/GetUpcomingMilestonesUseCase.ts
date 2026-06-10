import type { UseCase } from '../UseCase';
import type { IMilestoneRepository } from '../../repositories/IMilestoneRepository';
import type { Milestone } from '../../entities';

/** limit default 5, max 20. */
export class GetUpcomingMilestonesUseCase
  implements UseCase<number | undefined, Milestone[]>
{
  constructor(private readonly milestoneRepository: IMilestoneRepository) {}

  execute(limit?: number): Promise<Milestone[]> {
    return this.milestoneRepository.getUpcoming(limit);
  }
}
