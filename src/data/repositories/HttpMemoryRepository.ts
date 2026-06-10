import type { IMemoryDataSource } from '../datasources/IMemoryDataSource';
import type {
  CreateMemoryParams,
  IMemoryRepository,
  PageQuery,
  UpdateMemoryParams,
} from '../../domain/repositories/IMemoryRepository';
import type {
  Media,
  MediaUpload,
  Memory,
  MemoryCalendarDay,
  MemoryPage,
  MemoryTimeline,
} from '../../domain/entities';
import {
  mapCalendarDay,
  mapMedia,
  mapMemory,
  mapTimelineGroup,
  toCreateMemoryDto,
  toUpdateMemoryDto,
} from '../mappers/MemoryMapper';
import { guard } from '../mappers/ErrorMapper';

export class HttpMemoryRepository implements IMemoryRepository {
  constructor(private readonly dataSource: IMemoryDataSource) {}

  getTimeline(query?: PageQuery): Promise<MemoryTimeline> {
    return guard(async () => {
      const dto = await this.dataSource.getTimeline(query?.page, query?.size);
      return { groups: (dto.data ?? []).map(mapTimelineGroup), total: dto.total };
    });
  }

  create(params: CreateMemoryParams): Promise<Memory> {
    return guard(async () =>
      mapMemory(await this.dataSource.create(toCreateMemoryDto(params))),
    );
  }

  getCalendar(year: number, month: number): Promise<MemoryCalendarDay[]> {
    return guard(async () => {
      const dtos = await this.dataSource.getCalendar(year, month);
      return (dtos ?? []).map(mapCalendarDay);
    });
  }

  getByTag(tag: string, query?: PageQuery): Promise<MemoryPage> {
    return guard(async () => {
      const dto = await this.dataSource.getByTag(tag, query?.page, query?.size);
      return { memories: (dto.data ?? []).map(mapMemory), total: dto.total };
    });
  }

  getById(id: string): Promise<Memory> {
    return guard(async () => mapMemory(await this.dataSource.getById(id)));
  }

  update(id: string, params: UpdateMemoryParams): Promise<Memory> {
    return guard(async () =>
      mapMemory(await this.dataSource.update(id, toUpdateMemoryDto(params))),
    );
  }

  delete(id: string): Promise<void> {
    return guard(() => this.dataSource.delete(id));
  }

  uploadMedia(memoryId: string, file: MediaUpload): Promise<Media> {
    return guard(async () => mapMedia(await this.dataSource.uploadMedia(memoryId, file)));
  }

  deleteMedia(memoryId: string, mediaId: string): Promise<void> {
    return guard(() => this.dataSource.deleteMedia(memoryId, mediaId));
  }
}
