import type { DeviceTokenDto, NotificationDto } from '../types/api.types';
import type {
  AppNotification,
  DevicePlatform,
  DeviceToken,
  NotificationType,
} from '../../domain/entities';

export function mapNotification(dto: NotificationDto): AppNotification {
  return {
    id: dto.id,
    userId: dto.user_id,
    coupleId: dto.couple_id,
    type: dto.type as NotificationType,
    title: dto.title,
    body: dto.body,
    data: dto.data ?? {},
    isRead: dto.is_read,
    readAt: dto.read_at,
    createdAt: dto.created_at,
  };
}

export function mapDeviceToken(dto: DeviceTokenDto): DeviceToken {
  return {
    id: dto.id,
    userId: dto.user_id,
    token: dto.token,
    platform: dto.platform as DevicePlatform,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}
