import { AppState } from 'react-native';
import { QueryClient, focusManager } from '@tanstack/react-query';
import { AppError } from '../domain/errors/AppError';

// RN không có window focus — wire AppState để refetchOnWindowFocus hoạt động
AppState.addEventListener('change', status => {
  focusManager.setFocused(status === 'active');
});

/** Lỗi client (4xx) — retry vô nghĩa, fail luôn. */
const NO_RETRY_KINDS = new Set([
  'validation',
  'unauthorized', // AuthHttpClient đã tự refresh+retry 401 rồi
  'pro_required',
  'forbidden',
  'not_found',
  'conflict',
  'not_implemented',
]);

function shouldRetry(failureCount: number, error: unknown): boolean {
  if (AppError.is(error) && NO_RETRY_KINDS.has(error.kind)) return false;
  return failureCount < 2; // network/5xx: retry tối đa 2 lần
}

/**
 * QueryClient dùng chung toàn app.
 * - staleTime 5 phút: dữ liệu couple/memory ít đổi, đỡ refetch thừa
 * - gcTime 30 phút: giữ cache khi navigate qua lại giữa các tab
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: shouldRetry,
    },
    mutations: {
      retry: false,
    },
  },
});
