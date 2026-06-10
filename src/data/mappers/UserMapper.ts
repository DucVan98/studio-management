import type { TokenPairDto, UserDto } from '../types/api.types';
import type { AuthSession, AuthTokens, User } from '../../domain/entities';

export function mapUser(dto: UserDto): User {
  return {
    id: dto.id,
    email: dto.email,
    name: dto.name,
    avatarUrl: dto.avatar_url,
    partnerNickname: dto.partner_nickname,
    oauthProvider: dto.oauth_provider,
    emailVerified: dto.email_verified,
    coupleId: dto.couple_id,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

export function mapTokens(dto: TokenPairDto): AuthTokens {
  return {
    accessToken: dto.access_token,
    refreshToken: dto.refresh_token,
    expiresAt: dto.expires_at,
  };
}

export function mapAuthSession(dto: TokenPairDto): AuthSession {
  return { user: mapUser(dto.user), tokens: mapTokens(dto) };
}
