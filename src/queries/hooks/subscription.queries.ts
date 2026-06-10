import { queryKeys } from '../keys';
import { createQuery } from '../factory';

export const useSubscription = createQuery(
  queryKeys.subscription.all,
  di => di.getGetSubscriptionUseCase(),
);
