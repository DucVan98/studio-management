/**
 * Domain error — UI và use case chỉ phụ thuộc vào AppError,
 * không biết gì về HTTP layer (Dependency Inversion).
 */
export type AppErrorKind =
  | 'validation' // 400
  | 'unauthorized' // 401 — token invalid/expired, sai credentials
  | 'pro_required' // 402 — cần Couple Pro hoặc chạm limit free tier
  | 'forbidden' // 403 — email chưa verify / chưa có couple / không sở hữu
  | 'not_found' // 404
  | 'conflict' // 409 — email tồn tại, đã có couple
  | 'not_implemented' // 501 — OAuth
  | 'server' // 5xx
  | 'network' // timeout, mất mạng
  | 'unknown';

export class AppError extends Error {
  readonly kind: AppErrorKind;
  readonly status?: number;
  /** Error code từ server nếu có (vd INTERNAL_ERROR) */
  readonly code?: string;

  constructor(
    message: string,
    kind: AppErrorKind,
    options?: { status?: number; code?: string; cause?: unknown },
  ) {
    super(message);
    this.name = 'AppError';
    this.kind = kind;
    this.status = options?.status;
    this.code = options?.code;
    if (options?.cause !== undefined) {
      (this as { cause?: unknown }).cause = options.cause;
    }
  }

  static is(error: unknown): error is AppError {
    return error instanceof AppError;
  }

  get isProRequired(): boolean {
    return this.kind === 'pro_required';
  }

  get isUnauthorized(): boolean {
    return this.kind === 'unauthorized';
  }

  get isCoupleRequired(): boolean {
    return this.kind === 'forbidden' && this.message.includes('couple required');
  }
}
