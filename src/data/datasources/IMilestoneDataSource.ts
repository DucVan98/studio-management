import type {
  MilestoneDto,
  MilestoneListResponseDto,
  UpcomingMilestonesResponseDto,
} from '../types/api.types';

export interface IMilestoneDataSource {
  getMilestones(): Promise<MilestoneListResponseDto>;
  getUpcoming(limit?: number): Promise<UpcomingMilestonesResponseDto>;
  markReached(id: string): Promise<MilestoneDto>;
}
