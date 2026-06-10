import type {
  AppNotification,
  DevicePlatform,
  DeviceToken,
  NotificationPage,
} from '../entities';

export interface NotificationQuery {
  /** default 20, max 50 */
  limit?: number;
  offset?: number;
}

export interface INotificationRepository {
  /** GET /notifications */
  getNotifications(query?: NotificationQuery): Promise<NotificationPage>;
  /** PUT /notifications/:id/read */
  markRead(id: string): Promise<AppNotification>;
  /** PUT /notifications/read-all */
  markAllRead(): Promise<void>;
  /** DELETE /notifications/:id */
  delete(id: string): Promise<void>;
  /** POST /notifications/device-tokens — gọi sau khi xin permission & khi token đổi */
  registerDeviceToken(token: string, platform: DevicePlatform): Promise<DeviceToken>;
  /** DELETE /notifications/device-tokens/:token — gọi khi logout */
  unregisterDeviceToken(token: string): Promise<void>;
}
