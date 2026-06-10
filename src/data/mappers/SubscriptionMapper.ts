import type { SubscriptionDto } from '../types/api.types';
import type {
  Subscription,
  SubscriptionPlan,
  SubscriptionStatus,
} from '../../domain/entities';

export function mapSubscription(dto: SubscriptionDto): Subscription {
  return {
    isPro: dto.is_pro,
    plan: dto.plan as SubscriptionPlan,
    status: dto.status as SubscriptionStatus,
    proUntil: dto.pro_until,
    providerSubId: dto.provider_sub_id,
  };
}
