import type { Subscription } from '../entities';

export interface ISubscriptionRepository {
  /** GET /subscription */
  getSubscription(): Promise<Subscription>;
}
