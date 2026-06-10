import { HttpError } from '../../http';
import { AppError, type AppErrorKind } from '../../domain/errors/AppError';

function kindFromStatus(status?: number): AppErrorKind {
  switch (status) {
    case 400: return 'validation';
    case 401: return 'unauthorized';
    case 402: return 'pro_required';
    case 403: return 'forbidden';
    case 404: return 'not_found';
    case 409: return 'conflict';
    case 501: return 'not_implemented';
    default:
      if (status !== undefined && status >= 500) return 'server';
      return status === undefined ? 'network' : 'unknown';
  }
}

/** Map HttpError (data layer) → AppError (domain) — UI không phụ thuộc HTTP. */
export function toAppError(error: unknown): AppError {
  if (AppError.is(error)) return error;

  if (HttpError.isHttpError(error)) {
    const body = error.data as { message?: string; code?: string } | undefined;
    return new AppError(
      body?.message ?? error.message,
      kindFromStatus(error.status),
      { status: error.status, code: body?.code, cause: error },
    );
  }

  const message = error instanceof Error ? error.message : String(error);
  return new AppError(message, 'unknown', { cause: error });
}

/** Wrap mọi repository call: rethrow AppError thay vì HttpError. */
export async function guard<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    throw toAppError(error);
  }
}
