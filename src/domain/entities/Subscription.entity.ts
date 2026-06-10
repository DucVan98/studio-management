export type SubscriptionPlan = 'couple_pro' | 'free';

export type SubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'unpaid';

export interface Subscription {
  /** true khi status là active hoặc trialing */
  isPro: boolean;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  proUntil?: string;
  providerSubId?: string;
}
