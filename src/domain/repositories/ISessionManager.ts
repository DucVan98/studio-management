import type { AuthTokens } from '../entities';

/**
 * Abstraction vòng đời session cho use case (DIP) —
 * implementation: services/AuthSessionService.
 */
export interface ISessionManager {
  start(tokens: AuthTokens): Promise<void>;
  clear(): Promise<void>;
  /** Force refresh — cần sau khi accept invite để JWT có couple_id */
  refreshAccessToken(): Promise<string | null>;
  readonly refreshToken: string | null;
  readonly isAuthenticated: boolean;
}
