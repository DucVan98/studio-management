import type { HttpClient } from '../../http';
import type { IMilestoneDataSource } from './IMilestoneDataSource';
import type {
  MilestoneDto,
  MilestoneListResponseDto,
  UpcomingMilestonesResponseDto,
} from '../types/api.types';

export class HttpMilestoneDataSource implements IMilestoneDataSource {
  constructor(private readonly http: HttpClient) {}

  async getMilestones(): Promise<MilestoneListResponseDto> {
    const res = await this.http.get<MilestoneListResponseDto>('/milestones');
    return res.data;
  }

  async getUpcoming(limit?: number): Promise<UpcomingMilestonesResponseDto> {
    const res = await this.http.get<UpcomingMilestonesResponseDto>('/milestones/upcoming', {
      params: { limit },
    });
    return res.data;
  }

  async markReached(id: string): Promise<MilestoneDto> {
    const res = await this.http.patch<MilestoneDto>(`/milestones/${id}/reach`);
    return res.data;
  }
}
