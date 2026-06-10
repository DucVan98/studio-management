import type { UseCase } from '../UseCase';
import type { INotificationRepository } from '../../repositories/INotificationRepository';

/** Gọi khi logout. */
export class UnregisterDeviceTokenUseCase implements UseCase<string, void> {
  constructor(private readonly notificationRepository: INotificationRepository) {}

  execute(token: string): Promise<void> {
    return this.notificationRepository.unregisterDeviceToken(token);
  }
}
