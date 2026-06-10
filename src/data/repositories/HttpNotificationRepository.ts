import type { INotificationDataSource } from '../datasources/INotificationDataSource';
import type {
  INotificationRepository,
  NotificationQuery,
} from '../../domain/repositories/INotificationRepository';
import type {
  AppNotification,
  DevicePlatform,
  DeviceToken,
  NotificationPage,
} from '../../domain/entities';
import { mapDeviceToken, mapNotification } from '../mappers/NotificationMapper';
import { guard } from '../mappers/ErrorMapper';

export class HttpNotificationRepository implements INotificationRepository {
  constructor(private readonly dataSource: INotificationDataSource) {}

  getNotifications(query?: NotificationQuery): Promise<NotificationPage> {
    return guard(async () => {
      const dto = await this.dataSource.getNotifications(query?.limit, query?.offset);
      return {
        notifications: (dto.notifications ?? []).map(mapNotification),
        unreadCount: dto.unread_count,
      };
    });
  }

  markRead(id: string): Promise<AppNotification> {
    return guard(async () => mapNotification(await this.dataSource.markRead(id)));
  }

  markAllRead(): Promise<void> {
    return guard(() => this.dataSource.markAllRead());
  }

  delete(id: string): Promise<void> {
    return guard(() => this.dataSource.delete(id));
  }

  registerDeviceToken(token: string, platform: DevicePlatform): Promise<DeviceToken> {
    return guard(async () =>
      mapDeviceToken(await this.dataSource.registerDeviceToken({ token, platform })),
    );
  }

  unregisterDeviceToken(token: string): Promise<void> {
    return guard(() => this.dataSource.unregisterDeviceToken(token));
  }
}
