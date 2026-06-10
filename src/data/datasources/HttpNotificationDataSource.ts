import type { HttpClient } from '../../http';
import type { INotificationDataSource } from './INotificationDataSource';
import type {
  DeviceTokenDto,
  NotificationDto,
  NotificationListResponseDto,
  RegisterDeviceTokenRequestDto,
} from '../types/api.types';

export class HttpNotificationDataSource implements INotificationDataSource {
  constructor(private readonly http: HttpClient) {}

  async getNotifications(
    limit?: number,
    offset?: number,
  ): Promise<NotificationListResponseDto> {
    const res = await this.http.get<NotificationListResponseDto>('/notifications', {
      params: { limit, offset },
    });
    return res.data;
  }

  async markRead(id: string): Promise<NotificationDto> {
    const res = await this.http.put<NotificationDto>(`/notifications/${id}/read`);
    return res.data;
  }

  async markAllRead(): Promise<void> {
    await this.http.put<void>('/notifications/read-all');
  }

  async delete(id: string): Promise<void> {
    await this.http.delete<void>(`/notifications/${id}`);
  }

  async registerDeviceToken(body: RegisterDeviceTokenRequestDto): Promise<DeviceTokenDto> {
    const res = await this.http.post<DeviceTokenDto, RegisterDeviceTokenRequestDto>(
      '/notifications/device-tokens',
      body,
    );
    return res.data;
  }

  async unregisterDeviceToken(token: string): Promise<void> {
    await this.http.delete<void>(
      `/notifications/device-tokens/${encodeURIComponent(token)}`,
    );
  }
}
