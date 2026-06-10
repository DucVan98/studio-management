import { queryKeys } from '../keys';
import { createMutation, createParamQuery, createQuery } from '../factory';
import type { ActivityQuery } from '../../domain/repositories/ICoupleRepository';

// ── Queries ───────────────────────────────────────────────────────────────────

export const useCouple = createQuery(
  queryKeys.couple.detail(),
  di => di.getGetCoupleUseCase(),
);

export const useCoupleStats = createQuery(
  queryKeys.couple.stats(),
  di => di.getGetCoupleStatsUseCase(),
);

export const useCoupleActivity = createParamQuery(
  (query?: ActivityQuery) => queryKeys.couple.activity(query),
  di => di.getGetCoupleActivityUseCase(),
);

/** Preview invite — dùng ở màn accept. `enabled: !!code` khi code từ deep link. */
export const useInvitePreview = createParamQuery(
  (code: string) => queryKeys.couple.invite(code),
  di => di.getGetInviteUseCase(),
);

// ── Mutations ─────────────────────────────────────────────────────────────────

export const useUpdateStartDate = createMutation(di => di.getUpdateStartDateUseCase(), {
  // Đổi start date → days_together, milestones tự sinh đều đổi
  invalidates: [queryKeys.couple.all, queryKeys.milestones.all],
});

export const useUpdateTheme = createMutation(di => di.getUpdateThemeUseCase(), {
  invalidates: [queryKeys.couple.all],
});

export const useCreateInvite = createMutation(di => di.getCreateInviteUseCase());

/** Use case đã tự refresh JWT để có couple_id — clear cache cho data couple mới. */
export const useAcceptInvite = createMutation(di => di.getAcceptInviteUseCase(), {
  onSuccess: queryClient => queryClient.clear(),
});
