import type { UseCase } from '../UseCase';
import type { IMemoryRepository, PageQuery } from '../../repositories/IMemoryRepository';
import type { MemoryTimeline } from '../../entities';

/** Timeline kỷ niệm, nhóm theo tháng. size default 20, max 50. */
export class GetMemoryTimelineUseCase
  implements UseCase<PageQuery | undefined, MemoryTimeline>
{
  constructor(private readonly memoryRepository: IMemoryRepository) {}

  execute(query?: PageQuery): Promise<MemoryTimeline> {
    return this.memoryRepository.getTimeline(query);
  }
}
