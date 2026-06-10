import type { ActivityQuery } from '../domain/repositories/ICoupleRepository';
import type { NotificationQuery } from '../domain/repositories/INotificationRepository';

/**
 * Query key factory — tập trung một chỗ để invalidation nhất quán.
 * Convention: [domain, scope?, params?]
 */
export const queryKeys = {
  couple: {
    all: ['couple'] as const,
    detail: () => [...queryKeys.couple.all, 'detail'] as const,
    stats: () => [...queryKeys.couple.all, 'stats'] as const,
    activity: (query?: ActivityQuery) =>
      [...queryKeys.couple.all, 'activity', query ?? {}] as const,
    invite: (code: string) => [...queryKeys.couple.all, 'invite', code] as const,
  },

  memories: {
    all: ['memories'] as const,
    timeline: (size?: number) => [...queryKeys.memories.all, 'timeline', { size }] as const,
    calendar: (year: number, month: number) =>
      [...queryKeys.memories.all, 'calendar', { year, month }] as const,
    byTag: (tag: string, size?: number) =>
      [...queryKeys.memories.all, 'tag', tag, { size }] as const,
    detail: (id: string) => [...queryKeys.memories.all, 'detail', id] as const,
  },

  milestones: {
    all: ['milestones'] as const,
    list: () => [...queryKeys.milestones.all, 'list'] as const,
    upcoming: (limit?: number) =>
      [...queryKeys.milestones.all, 'upcoming', { limit }] as const,
  },

  notifications: {
    all: ['notifications'] as const,
    list: (query?: NotificationQuery) =>
      [...queryKeys.notifications.all, 'list', query ?? {}] as const,
  },

  subscription: {
    all: ['subscription'] as const,
  },
} as const;
