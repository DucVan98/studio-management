import type { HttpClient } from '../../http';
import type { IUserDataSource } from './IUserDataSource';
import type { UserDto } from '../types/api.types';
import type { MediaUpload } from '../../domain/entities';

/** Timeout riêng cho upload ảnh. */
const UPLOAD_TIMEOUT = 60_000;

export class HttpUserDataSource implements IUserDataSource {
  constructor(private readonly http: HttpClient) {}

  /** multipart/form-data, field name bắt buộc là `file`. */
  async uploadAvatar(file: MediaUpload): Promise<UserDto> {
    const form = new FormData();
    // React Native FormData file part: { uri, name, type }
    form.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.mimeType,
    } as unknown as Blob);

    const res = await this.http.post<UserDto, FormData>(
      '/users/me/avatar',
      form,
      { timeout: UPLOAD_TIMEOUT },
    );
    return res.data;
  }
}
