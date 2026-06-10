import type { HttpClient } from '../../http';
import type { IMemoryDataSource } from './IMemoryDataSource';
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

/** Timeout riêng cho upload media (video có thể lớn). */
const UPLOAD_TIMEOUT = 120_000;

export class HttpMemoryDataSource implements IMemoryDataSource {
  constructor(private readonly http: HttpClient) {}

  async getTimeline(page?: number, size?: number): Promise<TimelineResponseDto> {
    const res = await this.http.get<TimelineResponseDto>('/memories', {
      params: { page, size },
    });
    return res.data;
  }

  async create(body: CreateMemoryRequestDto): Promise<MemoryDto> {
    const res = await this.http.post<MemoryDto, CreateMemoryRequestDto>('/memories', body);
    return res.data;
  }

  async getCalendar(year: number, month: number): Promise<CalendarDayDto[]> {
    const res = await this.http.get<CalendarDayDto[]>('/memories/calendar', {
      params: { year, month },
    });
    return res.data;
  }

  async getByTag(tag: string, page?: number, size?: number): Promise<MemoryListResponseDto> {
    const res = await this.http.get<MemoryListResponseDto>(
      `/memories/tag/${encodeURIComponent(tag)}`,
      { params: { page, size } },
    );
    return res.data;
  }

  async getById(id: string): Promise<MemoryDto> {
    const res = await this.http.get<MemoryDto>(`/memories/${id}`);
    return res.data;
  }

  async update(id: string, body: UpdateMemoryRequestDto): Promise<MemoryDto> {
    const res = await this.http.put<MemoryDto, UpdateMemoryRequestDto>(
      `/memories/${id}`,
      body,
    );
    return res.data;
  }

  async delete(id: string): Promise<void> {
    await this.http.delete<void>(`/memories/${id}`);
  }

  /** multipart/form-data, field name bắt buộc là `file`. */
  async uploadMedia(memoryId: string, file: MediaUpload): Promise<MediaDto> {
    const form = new FormData();
    // React Native FormData file part: { uri, name, type }
    form.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.mimeType,
    } as unknown as Blob);

    const res = await this.http.post<MediaDto, FormData>(
      `/memories/${memoryId}/media`,
      form,
      { timeout: UPLOAD_TIMEOUT },
    );
    return res.data;
  }

  async deleteMedia(memoryId: string, mediaId: string): Promise<void> {
    await this.http.delete<void>(`/memories/${memoryId}/media/${mediaId}`);
  }
}
