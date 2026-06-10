import type { UseCase } from '../UseCase';
import type { IAuthRepository } from '../../repositories/IAuthRepository';
import type { INotificationRepository } from '../../repositories/INotificationRepository';
import type { ISessionManager } from '../../repositories/ISessionManager';

export interface LogoutParams {
  /** Push token hiện tại — sẽ được unregister trước khi logout */
  deviceToken?: string;
}

/**
 * Logout flow theo docs:
 * 1. DELETE /notifications/device-tokens/:token (best-effort)
 * 2. POST /auth/logout với X-Refresh-Token (best-effort)
 * 3. LUÔN clear session local — kể cả khi server call fail
 */
export class LogoutUseCase implements UseCase<LogoutParams | undefined, void> {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly notificationRepository: INotificationRepository,
    private readonly session: ISessionManager,
  ) {}

  async execute(params?: LogoutParams): Promise<void> {
    const refreshToken = this.session.refreshToken;
    try {
      if (params?.deviceToken) {
        await this.notificationRepository
          .unregisterDeviceToken(params.deviceToken)
          .catch(() => undefined);
      }
      if (refreshToken) {
        await this.authRepository.logout(refreshToken).catch(() => undefined);
      }
    } finally {
      await this.session.clear();
    }
  }
}
