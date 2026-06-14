import type { MediaUpload } from '../../domain/entities';
import type { UserDto } from '../types/api.types';

export interface IUserDataSource {
  /** POST /users/me/avatar — multipart/form-data, field `file`. */
  uploadAvatar(file: MediaUpload): Promise<UserDto>;
}
