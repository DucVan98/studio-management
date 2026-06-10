import type { IMilestoneDataSource } from '../datasources/IMilestoneDataSource';
import type { IMilestoneRepository } from '../../domain/repositories/IMilestoneRepository';
import type { Milestone, MilestoneList } from '../../domain/entities';
import { mapMilestone } from '../mappers/MilestoneMapper';
import { guard } from '../mappers/ErrorMapper';

export class HttpMilestoneRepository implements IMilestoneRepository {
  constructor(private readonly dataSource: IMilestoneDataSource) {}

  getMilestones(): Promise<MilestoneList> {
    return guard(async () => {
      const dto = await this.dataSource.getMilestones();
      return { milestones: (dto.milestones ?? []).map(mapMilestone), total: dto.total };
    });
  }

  getUpcoming(limit?: number): Promise<Milestone[]> {
    return guard(async () => {
      const dto = await this.dataSource.getUpcoming(limit);
      return (dto.milestones ?? []).map(mapMilestone);
    });
  }

  markReached(id: string): Promise<Milestone> {
    return guard(async () => mapMilestone(await this.dataSource.markReached(id)));
  }
}
