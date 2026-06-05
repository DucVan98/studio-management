import type { IAuthRepository, LoginCredentials } from '../repositories/IAuthRepository';
import type { UserEntity } from '../entities/User.entity';
import type { AuthTokens } from '../repositories/IAuthRepository';

export interface LoginResult {
  user: UserEntity;
  tokens: AuthTokens;
}

/**
 * LoginUseCase – Business logic for user authentication.
 *
 * Follows Clean Architecture: Use Case depends on repository interface,
 * not concrete implementation.
 */
export class LoginUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(credentials: LoginCredentials): Promise<LoginResult> {
    if (!credentials.email || !credentials.password) {
      throw new Error('Email và mật khẩu không được để trống');
    }

    if (!isValidEmail(credentials.email)) {
      throw new Error('Email không hợp lệ');
    }

    return this.authRepository.login(credentials);
  }
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
