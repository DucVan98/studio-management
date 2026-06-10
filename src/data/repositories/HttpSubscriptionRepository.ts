import type { ISubscriptionDataSource } from '../datasources/ISubscriptionDataSource';
import type { ISubscriptionRepository } from '../../domain/repositories/ISubscriptionRepository';
import type { Subscription } from '../../domain/entities';
import { mapSubscription } from '../mappers/SubscriptionMapper';
import { guard } from '../mappers/ErrorMapper';

export class HttpSubscriptionRepository implements ISubscriptionRepository {
  constructor(private readonly dataSource: ISubscriptionDataSource) {}

  getSubscription(): Promise<Subscription> {
    return guard(async () => mapSubscription(await this.dataSource.getSubscription()));
  }
}
