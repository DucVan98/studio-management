import { queryKeys } from '../keys';
import { createMutation, createParamQuery, createQuery } from '../factory';

export const useMilestones = createQuery(
  queryKeys.milestones.list(),
  di => di.getGetMilestonesUseCase(),
);

export const useUpcomingMilestones = createParamQuery(
  (limit?: number) => queryKeys.milestones.upcoming(limit),
  di => di.getGetUpcomingMilestonesUseCase(),
);

export const useReachMilestone = createMutation(di => di.getReachMilestoneUseCase(), {
  invalidates: [queryKeys.milestones.all, queryKeys.couple.all],
});
