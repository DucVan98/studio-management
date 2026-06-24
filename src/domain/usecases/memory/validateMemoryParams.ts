import { AppError } from '../../errors/AppError';
import type { UpdateMemoryParams } from '../../repositories/IMemoryRepository';

function validateTitle(title: string | undefined): void {
  if (title !== undefined && (title.length < 1 || title.length > 200)) {
    throw new AppError('Title must be 1–200 characters', 'validation');
  }
}

function validateNote(note: string | undefined): void {
  if (note !== undefined && note.length > 2000) {
    throw new AppError('Note must be at most 2000 characters', 'validation');
  }
}

function validateMemoryDate(memoryDate: string | undefined): void {
  if (memoryDate !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(memoryDate)) {
    throw new AppError('Memory date must be YYYY-MM-DD', 'validation');
  }
}

function validateTags(tags: string[] | undefined): void {
  if (tags === undefined) return;
  if (tags.length > 10) {
    throw new AppError('At most 10 tags allowed', 'validation');
  }
  if (tags.some(tag => tag.length < 1 || tag.length > 30)) {
    throw new AppError('Each tag must be 1–30 characters', 'validation');
  }
}

/** Constraints theo API.md: POST/PUT /memories */
export function validateMemoryParams(params: UpdateMemoryParams): void {
  validateTitle(params.title);
  validateNote(params.note);
  validateMemoryDate(params.memoryDate);
  validateTags(params.tags);
}
