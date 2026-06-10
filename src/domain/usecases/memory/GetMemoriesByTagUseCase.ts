import type { UseCase } from '../UseCase';
import type { IMemoryRepository, PageQuery } from '../../repositories/IMemoryRepository';
import type { MemoryPage } from '../../entities';

export interface MemoriesByTagQuery extends PageQuery {
  tag: string;
}

export class GetMemoriesByTagUseCase
  implements UseCase<MemoriesByTagQuery, MemoryPage>
{
  constructor(private readonly memoryRepository: IMemoryRepository) {}

  execute({ tag, ...query }: MemoriesByTagQuery): Promise<MemoryPage> {
    return this.memoryRepository.getByTag(tag, query);
  }
}
