import type { UseCase } from '../UseCase';
import type { IMemoryRepository } from '../../repositories/IMemoryRepository';
import type { Media, MediaUpload } from '../../entities';
import { AppError } from '../../errors/AppError';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/quicktime',
];

export interface UploadMediaInput {
  memoryId: string;
  file: MediaUpload;
}

/**
 * Upload media (multipart, field `file`).
 * Server tự detect MIME từ bytes — check ở client chỉ để fail-fast.
 * Free tier 500MB/couple → vượt limit sẽ nhận AppError kind 'pro_required'.
 */
export class UploadMemoryMediaUseCase implements UseCase<UploadMediaInput, Media> {
  constructor(private readonly memoryRepository: IMemoryRepository) {}

  execute({ memoryId, file }: UploadMediaInput): Promise<Media> {
    if (!ALLOWED_MIME_TYPES.includes(file.mimeType)) {
      throw new AppError(`unsupported file type: ${file.mimeType}`, 'validation');
    }
    return this.memoryRepository.uploadMedia(memoryId, file);
  }
}
