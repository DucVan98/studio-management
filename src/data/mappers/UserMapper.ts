import type { UserEntity } from '../../domain/entities/User.entity';
import type { AuthLoginResponse } from '../datasources/IAuthDataSource';

export function mapUserFromApi(
  raw: AuthLoginResponse['user'],
): UserEntity {
  return {
    id: raw.id,
    email: raw.email,
    name: raw.name,
    avatar: raw.avatar,
    createdAt: raw.created_at ? new Date(raw.created_at) : new Date(),
    updatedAt: raw.updated_at ? new Date(raw.updated_at) : new Date(),
  };
}
