import { AppError } from '../../errors/AppError';
import type { UpdateMemoryParams } from '../../repositories/IMemoryRepository';

/** Constraints theo API.md: POST/PUT /memories */
export function validateMemoryParams(params: UpdateMemoryParams): void {
  if (params.title !== undefined && (params.title.length < 1 || params.title.length > 200)) {
    throw new AppError('Title must be 1–200 characters', 'validation');
  }
  if (params.note !== undefined && params.note.length > 2000) {
    throw new AppError('Note must be at most 2000 characters', 'validation');
  }
  if (params.memoryDate !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(params.memoryDate)) {
    throw new AppError('Memory date must be YYYY-MM-DD', 'validation');
  }
  if (params.tags !== undefined) {
    if (params.tags.length > 10) {
      throw new AppError('At most 10 tags allowed', 'validation');
    }
    for (const tag of params.tags) {
      if (tag.length < 1 || tag.length > 30) {
        throw new AppError('Each tag must be 1–30 characters', 'validation');
      }
    }
  }
}
