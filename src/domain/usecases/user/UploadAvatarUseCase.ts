import type { UseCase } from '../UseCase';
import type { IUserRepository } from '../../repositories/IUserRepository';
import type { MediaUpload, User } from '../../entities';
import { AppError } from '../../errors/AppError';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/heic',
];

/**
 * Upload avatar (multipart, field `file`).
 * Server tự detect MIME từ bytes — check ở client chỉ để fail-fast.
 */
export class UploadAvatarUseCase implements UseCase<MediaUpload, User> {
  constructor(private readonly userRepository: IUserRepository) {}

  execute(file: MediaUpload): Promise<User> {
    if (!ALLOWED_MIME_TYPES.includes(file.mimeType)) {
      throw new AppError(`unsupported image type: ${file.mimeType}`, 'validation');
    }
    return this.userRepository.uploadAvatar(file);
  }
}
