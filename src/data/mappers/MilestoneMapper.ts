import type { MilestoneDto } from '../types/api.types';
import type { Milestone } from '../../domain/entities';

export function mapMilestone(dto: MilestoneDto): Milestone {
  return {
    id: dto.id,
    coupleId: dto.couple_id,
    type: dto.type,
    title: dto.title,
    date: dto.date,
    daysOffset: dto.days_offset,
    icon: dto.icon,
    isReached: dto.is_reached,
    reachedAt: dto.reached_at,
    createdAt: dto.created_at,
  };
}
