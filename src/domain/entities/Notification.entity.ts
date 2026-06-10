export type NotificationType =
  | 'MEMORY_CREATED'
  | 'MILESTONE_REACHED'
  | 'INVITE_ACCEPTED'
  | 'SYSTEM';

export interface AppNotification {
  id: string;
  userId: string;
  coupleId?: string;
  type: NotificationType;
  title: string;
  body: string;
  data: Record<string, unknown>;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface NotificationPage {
  notifications: AppNotification[];
  unreadCount: number;
}

export type DevicePlatform = 'fcm' | 'apns';

export interface DeviceToken {
  id: string;
  userId: string;
  token: string;
  platform: DevicePlatform;
  createdAt: string;
  updatedAt: string;
}
