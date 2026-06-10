import type { UseCase } from '../UseCase';
import type { INotificationRepository } from '../../repositories/INotificationRepository';

export class DeleteNotificationUseCase implements UseCase<string, void> {
  constructor(private readonly notificationRepository: INotificationRepository) {}

  execute(id: string): Promise<void> {
    return this.notificationRepository.delete(id);
  }
}
