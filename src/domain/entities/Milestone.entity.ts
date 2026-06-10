export type MilestoneType = 'system' | 'custom';

export interface Milestone {
  id: string;
  coupleId: string;
  type: MilestoneType;
  title: string;
  date: string;
  daysOffset: number;
  icon: string;
  isReached: boolean;
  reachedAt?: string;
  createdAt: string;
}

export interface MilestoneList {
  milestones: Milestone[];
  total: number;
}
