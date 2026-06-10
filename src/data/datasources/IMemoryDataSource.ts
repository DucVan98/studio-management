import type {
  CalendarDayDto,
  CreateMemoryRequestDto,
  MediaDto,
  MemoryDto,
  MemoryListResponseDto,
  TimelineResponseDto,
  UpdateMemoryRequestDto,
} from '../types/api.types';
import type { MediaUpload } from '../../domain/entities';

export interface IMemoryDataSource {
  getTimeline(page?: number, size?: number): Promise<TimelineResponseDto>;
  create(body: CreateMemoryRequestDto): Promise<MemoryDto>;
  getCalendar(year: number, month: number): Promise<CalendarDayDto[]>;
  getByTag(tag: string, page?: number, size?: number): Promise<MemoryListResponseDto>;
  getById(id: string): Promise<MemoryDto>;
  update(id: string, body: UpdateMemoryRequestDto): Promise<MemoryDto>;
  delete(id: string): Promise<void>;
  uploadMedia(memoryId: string, file: MediaUpload): Promise<MediaDto>;
  deleteMedia(memoryId: string, mediaId: string): Promise<void>;
}
