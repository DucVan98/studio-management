import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import type { MediaUpload, User } from '../../domain/entities';
import type { IUserDataSource } from '../datasources/IUserDataSource';
import { mapUser } from '../mappers/UserMapper';

export class HttpUserRepository implements IUserRepository {
  constructor(private readonly dataSource: IUserDataSource) {}

  async uploadAvatar(file: MediaUpload): Promise<User> {
    const dto = await this.dataSource.uploadAvatar(file);
    return mapUser(dto);
  }
}
