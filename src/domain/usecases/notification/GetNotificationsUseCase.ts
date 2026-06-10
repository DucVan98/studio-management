import type { UseCase } from '../UseCase';
import type {
  INotificationRepository,
  NotificationQuery,
} from '../../repositories/INotificationRepository';
import type { NotificationPage } from '../../entities';

export class GetNotificationsUseCase
  implements UseCase<NotificationQuery | undefined, NotificationPage>
{
  constructor(private readonly notificationRepository: INotificationRepository) {}

  execute(query?: NotificationQuery): Promise<NotificationPage> {
    return this.notificationRepository.getNotifications(query);
  }
}
