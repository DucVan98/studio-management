import type { UseCase } from '../UseCase';
import type { INotificationRepository } from '../../repositories/INotificationRepository';
import type { DevicePlatform, DeviceToken } from '../../entities';

export interface RegisterDeviceTokenParams {
  token: string;
  platform: DevicePlatform; // 'fcm' | 'apns'
}

/** Gọi sau khi xin push permission và mỗi lần token đổi. */
export class RegisterDeviceTokenUseCase
  implements UseCase<RegisterDeviceTokenParams, DeviceToken>
{
  constructor(private readonly notificationRepository: INotificationRepository) {}

  execute(params: RegisterDeviceTokenParams): Promise<DeviceToken> {
    return this.notificationRepository.registerDeviceToken(params.token, params.platform);
  }
}
