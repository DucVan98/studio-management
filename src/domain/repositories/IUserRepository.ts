import type { MediaUpload, User } from '../entities';

/** Thao tác dữ liệu người dùng hiện tại. */
export interface IUserRepository {
  /** POST /users/me/avatar (multipart) → user đã cập nhật avatar. */
  uploadAvatar(file: MediaUpload): Promise<User>;
}
