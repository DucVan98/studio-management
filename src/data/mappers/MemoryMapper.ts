import type {
  CalendarDayDto,
  CreateMemoryRequestDto,
  MediaDto,
  MemoryDto,
  TimelineGroupDto,
} from '../types/api.types';
import type {
  Media,
  Memory,
  MemoryCalendarDay,
  MemoryTimelineGroup,
} from '../../domain/entities';
import type {
  CreateMemoryParams,
  UpdateMemoryParams,
} from '../../domain/repositories/IMemoryRepository';

export function mapMedia(dto: MediaDto): Media {
  return {
    id: dto.id,
    memoryId: dto.memory_id,
    coupleId: dto.couple_id,
    type: dto.type,
    url: dto.url,
    thumbUrl: dto.thumb_url,
    sizeBytes: dto.size_bytes,
    width: dto.width,
    height: dto.height,
    duration: dto.duration,
    sortOrder: dto.sort_order,
    createdAt: dto.created_at,
  };
}

export function mapMemory(dto: MemoryDto): Memory {
  return {
    id: dto.id,
    coupleId: dto.couple_id,
    createdById: dto.created_by_id,
    title: dto.title,
    note: dto.note,
    memoryDate: dto.memory_date,
    locationName: dto.location_name,
    latitude: dto.latitude,
    longitude: dto.longitude,
    coverUrl: dto.cover_url,
    mediaCount: dto.media_count,
    tags: dto.tags ?? [],
    media: dto.media?.map(mapMedia),
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

export function mapTimelineGroup(dto: TimelineGroupDto): MemoryTimelineGroup {
  return {
    year: dto.year,
    month: dto.month,
    label: dto.label,
    memories: dto.memories.map(mapMemory),
  };
}

export function mapCalendarDay(dto: CalendarDayDto): MemoryCalendarDay {
  return { date: dto.date, memoryCount: dto.memory_count };
}

export function toCreateMemoryDto(params: CreateMemoryParams): CreateMemoryRequestDto {
  return {
    title: params.title,
    note: params.note,
    memory_date: params.memoryDate,
    location_name: params.locationName,
    latitude: params.latitude,
    longitude: params.longitude,
    tags: params.tags,
  };
}

export function toUpdateMemoryDto(params: UpdateMemoryParams): Partial<CreateMemoryRequestDto> {
  const dto: Partial<CreateMemoryRequestDto> = {};
  if (params.title !== undefined) dto.title = params.title;
  if (params.note !== undefined) dto.note = params.note;
  if (params.memoryDate !== undefined) dto.memory_date = params.memoryDate;
  if (params.locationName !== undefined) dto.location_name = params.locationName;
  if (params.latitude !== undefined) dto.latitude = params.latitude;
  if (params.longitude !== undefined) dto.longitude = params.longitude;
  if (params.tags !== undefined) dto.tags = params.tags;
  return dto;
}
