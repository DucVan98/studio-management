import type { UseCase } from '../UseCase';
import type { INotificationRepository } from '../../repositories/INotificationRepository';

export class MarkAllNotificationsReadUseCase implements UseCase<void, void> {
  constructor(private readonly notificationRepository: INotificationRepository) {}

  execute(): Promise<void> {
    return this.notificationRepository.markAllRead();
  }
}
