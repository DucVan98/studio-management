import type { UseCase } from '../UseCase';
import type { INotificationRepository } from '../../repositories/INotificationRepository';
import type { AppNotification } from '../../entities';

export class MarkNotificationReadUseCase implements UseCase<string, AppNotification> {
  constructor(private readonly notificationRepository: INotificationRepository) {}

  execute(id: string): Promise<AppNotification> {
    return this.notificationRepository.markRead(id);
  }
}
