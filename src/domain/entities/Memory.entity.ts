export type MediaType = 'image' | 'video';

export interface Media {
  id: string;
  memoryId: string;
  coupleId: string;
  type: MediaType;
  url: string;
  thumbUrl?: string;
  sizeBytes: number;
  width: number;
  height: number;
  duration: number;
  sortOrder: number;
  createdAt: string;
}

export interface Memory {
  id: string;
  coupleId: string;
  createdById: string;
  title: string;
  note?: string;
  memoryDate: string;
  locationName?: string;
  latitude?: number;
  longitude?: number;
  coverUrl?: string;
  mediaCount: number;
  tags: string[];
  /** Chỉ có ở GET /memories/:id, absent trong list */
  media?: Media[];
  createdAt: string;
  updatedAt: string;
}

export interface MemoryTimelineGroup {
  year: number;
  month: number;
  label: string;
  memories: Memory[];
}

export interface MemoryTimeline {
  groups: MemoryTimelineGroup[];
  total: number;
}

export interface MemoryPage {
  memories: Memory[];
  total: number;
}

export interface MemoryCalendarDay {
  date: string; // YYYY-MM-DD
  memoryCount: number;
}

/** File local để upload — uri từ image picker */
export interface MediaUpload {
  uri: string;
  name: string;
  mimeType: string;
}
