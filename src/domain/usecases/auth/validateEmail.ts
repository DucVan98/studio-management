import { AppError } from '../../errors/AppError';

/** Đủ chặt cho client-side: có local part, @, domain có dấu chấm, không khoảng trắng. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Giới hạn theo RFC 5321 — tránh gửi chuỗi quá dài lên server. */
const EMAIL_MAX_LENGTH = 254;

/** Validate email format ở domain layer — ném AppError('validation') nếu sai. */
export function validateEmail(email: string): string {
  const trimmed = email.trim();
  if (trimmed.length === 0) {
    throw new AppError('Email is required', 'validation');
  }
  if (trimmed.length > EMAIL_MAX_LENGTH || !EMAIL_RE.test(trimmed)) {
    throw new AppError('Invalid email format', 'validation');
  }
  return trimmed;
}
