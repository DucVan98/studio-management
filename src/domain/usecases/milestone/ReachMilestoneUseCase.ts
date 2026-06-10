import type { UseCase } from '../UseCase';
import type { IMilestoneRepository } from '../../repositories/IMilestoneRepository';
import type { Milestone } from '../../entities';

/** Đánh dấu milestone đã đạt (PATCH /milestones/:id/reach). */
export class ReachMilestoneUseCase implements UseCase<string, Milestone> {
  constructor(private readonly milestoneRepository: IMilestoneRepository) {}

  execute(id: string): Promise<Milestone> {
    return this.milestoneRepository.markReached(id);
  }
}
