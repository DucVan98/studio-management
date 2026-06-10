import {
  useInfiniteQuery,
  type InfiniteData,
  type QueryKey,
} from '@tanstack/react-query';
import { DIContainer } from '../../di/DIContainer';
import { queryKeys } from '../keys';
import { createMutation, createParamQuery } from '../factory';
import type { AppError } from '../../domain/errors/AppError';
import type { MemoryPage, MemoryTimeline } from '../../domain/entities';
import type { CalendarQuery } from '../../domain/usecases/memory/GetMemoryCalendarUseCase';

// ── Queries ───────────────────────────────────────────────────────────────────

export const useMemoryDetail = createParamQuery(
  (id: string) => queryKeys.memories.detail(id),
  di => di.getGetMemoryDetailUseCase(),
);

export const useMemoryCalendar = createParamQuery(
  (query: CalendarQuery) => queryKeys.memories.calendar(query.year, query.month),
  di => di.getGetMemoryCalendarUseCase(),
);

/** Timeline vô hạn (page-based) — dùng với FlatList onEndReached → fetchNextPage(). */
export function useMemoryTimeline(size = 20) {
  return useInfiniteQuery<
    MemoryTimeline,
    AppError,
    InfiniteData<MemoryTimeline>,
    QueryKey,
    number
  >({
    queryKey: queryKeys.memories.timeline(size),
    queryFn: ({ pageParam }) =>
      DIContainer.getInstance()
        .getGetMemoryTimelineUseCase()
        .execute({ page: pageParam, size }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce(
        (sum, page) =>
          sum + page.groups.reduce((m, group) => m + group.memories.length, 0),
        0,
      );
      return loaded < lastPage.total ? allPages.length + 1 : undefined;
    },
  });
}

/** Memories theo tag, vô hạn. */
export function useMemoriesByTag(tag: string, size = 20) {
  return useInfiniteQuery<
    MemoryPage,
    AppError,
    InfiniteData<MemoryPage>,
    QueryKey,
    number
  >({
    queryKey: queryKeys.memories.byTag(tag, size),
    queryFn: ({ pageParam }) =>
      DIContainer.getInstance()
        .getGetMemoriesByTagUseCase()
        .execute({ tag, page: pageParam, size }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, page) => sum + page.memories.length, 0);
      return loaded < lastPage.total ? allPages.length + 1 : undefined;
    },
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────────
// Memory thay đổi → stats/activity của couple cũng đổi → invalidate cả hai

export const useCreateMemory = createMutation(di => di.getCreateMemoryUseCase(), {
  invalidates: [queryKeys.memories.all, queryKeys.couple.all],
});

export const useUpdateMemory = createMutation(di => di.getUpdateMemoryUseCase(), {
  invalidates: [queryKeys.memories.all],
});

export const useDeleteMemory = createMutation(di => di.getDeleteMemoryUseCase(), {
  invalidates: [queryKeys.memories.all, queryKeys.couple.all],
});

export const useUploadMemoryMedia = createMutation(
  di => di.getUploadMemoryMediaUseCase(),
  { invalidates: [queryKeys.memories.all, queryKeys.couple.all] },
);

export const useDeleteMemoryMedia = createMutation(
  di => di.getDeleteMemoryMediaUseCase(),
  { invalidates: [queryKeys.memories.all, queryKeys.couple.all] },
);
