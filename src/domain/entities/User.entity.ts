export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  partnerNickname?: string;
  oauthProvider?: string;
  emailVerified: boolean;
  /** Rỗng/undefined khi chưa link partner — route cần couple sẽ trả 403 */
  coupleId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  /** RFC3339 — dùng để chủ động refresh trước khi hết hạn */
  expiresAt: string;
}

/** Kết quả của login / verify-email / refresh (TokenPair của backend). */
export interface AuthSession {
  user: User;
  tokens: AuthTokens;
}

export interface RegistrationResult {
  userId: string;
  message: string;
}
