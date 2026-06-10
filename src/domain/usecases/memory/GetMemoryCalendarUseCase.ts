import type { UseCase } from '../UseCase';
import type { IMemoryRepository } from '../../repositories/IMemoryRepository';
import type { MemoryCalendarDay } from '../../entities';

export interface CalendarQuery {
  year: number;
  month: number; // 1–12
}

export class GetMemoryCalendarUseCase
  implements UseCase<CalendarQuery, MemoryCalendarDay[]>
{
  constructor(private readonly memoryRepository: IMemoryRepository) {}

  execute(query: CalendarQuery): Promise<MemoryCalendarDay[]> {
    return this.memoryRepository.getCalendar(query.year, query.month);
  }
}
