import type { UseCase } from '../UseCase';
import type { IMemoryRepository } from '../../repositories/IMemoryRepository';
import type { Memory } from '../../entities';

/** Chi tiết memory — kèm media[] và tags. */
export class GetMemoryDetailUseCase implements UseCase<string, Memory> {
  constructor(private readonly memoryRepository: IMemoryRepository) {}

  execute(id: string): Promise<Memory> {
    return this.memoryRepository.getById(id);
  }
}
