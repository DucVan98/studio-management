import type {
  DeviceTokenDto,
  NotificationDto,
  NotificationListResponseDto,
  RegisterDeviceTokenRequestDto,
} from '../types/api.types';

export interface INotificationDataSource {
  getNotifications(limit?: number, offset?: number): Promise<NotificationListResponseDto>;
  markRead(id: string): Promise<NotificationDto>;
  markAllRead(): Promise<void>;
  delete(id: string): Promise<void>;
  registerDeviceToken(body: RegisterDeviceTokenRequestDto): Promise<DeviceTokenDto>;
  unregisterDeviceToken(token: string): Promise<void>;
}
