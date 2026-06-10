import {
  useInfiniteQuery,
  type InfiniteData,
  type QueryKey,
} from '@tanstack/react-query';
import { DIContainer } from '../../di/DIContainer';
import { queryKeys } from '../keys';
import { createMutation } from '../factory';
import type { AppError } from '../../domain/errors/AppError';
import type { NotificationPage } from '../../domain/entities';

/** Danh sách notification vô hạn (offset-based). Refetch mỗi phút khi mở màn. */
export function useNotifications(limit = 20) {
  return useInfiniteQuery<
    NotificationPage,
    AppError,
    InfiniteData<NotificationPage>,
    QueryKey,
    number
  >({
    queryKey: queryKeys.notifications.list({ limit }),
    queryFn: ({ pageParam }) =>
      DIContainer.getInstance()
        .getGetNotificationsUseCase()
        .execute({ limit, offset: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastOffset) =>
      lastPage.notifications.length === limit ? lastOffset + limit : undefined,
    staleTime: 60 * 1000, // notification cần tươi hơn data couple
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export const useMarkNotificationRead = createMutation(
  di => di.getMarkNotificationReadUseCase(),
  { invalidates: [queryKeys.notifications.all] },
);

export const useMarkAllNotificationsRead = createMutation(
  di => di.getMarkAllNotificationsReadUseCase(),
  { invalidates: [queryKeys.notifications.all] },
);

export const useDeleteNotification = createMutation(
  di => di.getDeleteNotificationUseCase(),
  { invalidates: [queryKeys.notifications.all] },
);

export const useRegisterDeviceToken = createMutation(di =>
  di.getRegisterDeviceTokenUseCase(),
);

export const useUnregisterDeviceToken = createMutation(di =>
  di.getUnregisterDeviceTokenUseCase(),
);
