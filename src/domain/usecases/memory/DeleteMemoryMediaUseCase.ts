import type { UseCase } from '../UseCase';
import type { IMemoryRepository } from '../../repositories/IMemoryRepository';

export interface DeleteMediaInput {
  memoryId: string;
  mediaId: string;
}

export class DeleteMemoryMediaUseCase implements UseCase<DeleteMediaInput, void> {
  constructor(private readonly memoryRepository: IMemoryRepository) {}

  execute({ memoryId, mediaId }: DeleteMediaInput): Promise<void> {
    return this.memoryRepository.deleteMedia(memoryId, mediaId);
  }
}
