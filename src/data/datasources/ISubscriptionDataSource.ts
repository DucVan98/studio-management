import type { SubscriptionDto } from '../types/api.types';

export interface ISubscriptionDataSource {
  getSubscription(): Promise<SubscriptionDto>;
}
