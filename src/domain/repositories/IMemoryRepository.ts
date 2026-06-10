import type {
  Media,
  MediaUpload,
  Memory,
  MemoryCalendarDay,
  MemoryPage,
  MemoryTimeline,
} from '../entities';

export interface PageQuery {
  /** default 1 */
  page?: number;
  /** default 20, max 50 */
  size?: number;
}

export interface CreateMemoryParams {
  title: string; // 1–200
  note?: string; // max 2000
  memoryDate: string; // YYYY-MM-DD
  locationName?: string;
  latitude?: number;
  longitude?: number;
  tags?: string[]; // max 10 tags, mỗi tag 1–30 chars
}

export type UpdateMemoryParams = Partial<CreateMemoryParams>;

export interface IMemoryRepository {
  /** GET /memories — timeline nhóm theo tháng */
  getTimeline(query?: PageQuery): Promise<MemoryTimeline>;
  /** POST /memories */
  create(params: CreateMemoryParams): Promise<Memory>;
  /** GET /memories/calendar */
  getCalendar(year: number, month: number): Promise<MemoryCalendarDay[]>;
  /** GET /memories/tag/:tag */
  getByTag(tag: string, query?: PageQuery): Promise<MemoryPage>;
  /** GET /memories/:id — kèm media + tags */
  getById(id: string): Promise<Memory>;
  /** PUT /memories/:id — partial update */
  update(id: string, params: UpdateMemoryParams): Promise<Memory>;
  /** DELETE /memories/:id — soft delete */
  delete(id: string): Promise<void>;
  /** POST /memories/:id/media — multipart, free tier 500MB/couple */
  uploadMedia(memoryId: string, file: MediaUpload): Promise<Media>;
  /** DELETE /memories/:id/media/:mid */
  deleteMedia(memoryId: string, mediaId: string): Promise<void>;
}
