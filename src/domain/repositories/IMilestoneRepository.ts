import type { Milestone, MilestoneList } from '../entities';

export interface IMilestoneRepository {
  /** GET /milestones */
  getMilestones(): Promise<MilestoneList>;
  /** GET /milestones/upcoming — limit default 5, max 20 */
  getUpcoming(limit?: number): Promise<Milestone[]>;
  /** PATCH /milestones/:id/reach */
  markReached(id: string): Promise<Milestone>;
}
