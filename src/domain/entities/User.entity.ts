// ── User Entity ───────────────────────────────────────────────────────────────

export interface UserEntity {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export function createUserEntity(raw: Record<string, unknown>): UserEntity {
  return {
    id: String(raw['id']),
    email: String(raw['email']),
    name: String(raw['name']),
    avatar: raw['avatar'] as string | undefined,
    createdAt: raw['createdAt'] ? new Date(raw['createdAt'] as string) : new Date(),
    updatedAt: raw['updatedAt'] ? new Date(raw['updatedAt'] as string) : new Date(),
  };
}
