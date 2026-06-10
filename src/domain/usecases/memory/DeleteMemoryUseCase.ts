import type { UseCase } from '../UseCase';
import type { IMemoryRepository } from '../../repositories/IMemoryRepository';

export class DeleteMemoryUseCase implements UseCase<string, void> {
  constructor(private readonly memoryRepository: IMemoryRepository) {}

  execute(id: string): Promise<void> {
    return this.memoryRepository.delete(id);
  }
}
