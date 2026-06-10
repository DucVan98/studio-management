import type { UseCase } from '../UseCase';
import type { ISubscriptionRepository } from '../../repositories/ISubscriptionRepository';
import type { Subscription } from '../../entities';

export class GetSubscriptionUseCase implements UseCase<void, Subscription> {
  constructor(private readonly subscriptionRepository: ISubscriptionRepository) {}

  execute(): Promise<Subscription> {
    return this.subscriptionRepository.getSubscription();
  }
}
