import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useValue } from '@legendapp/state/react';
import { authStore$ } from '../../stores/auth.store';
import { AvatarPair, SectionHeader, Avatar, Icon, Skeleton, Screen } from '../../components/ui';
import { useCoupleStats, useCoupleActivity } from '../../queries/hooks/couple.queries';
import { useUpcomingMilestones } from '../../queries/hooks/milestone.queries';
import { useMemoryTimeline } from '../../queries/hooks/memory.queries';
import type { CoupleActivity, Memory, MemoryTimeline } from '../../domain/entities';
import type { TFunction } from 'i18next';

/** Chào theo khung giờ trong ngày */
function greetingKey(hour: number): 'greetingMorning' | 'greetingAfternoon' | 'greetingEvening' {
  if (hour < 12) return 'greetingMorning';
  if (hour < 18) return 'greetingAfternoon';
  return 'greetingEvening';
}

/** Số ngày từ a → b (không âm) */
function daysBetween(a: Date, b: Date): number {
  return Math.max(0, Math.floor((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24)));
}

/** Thời gian tương đối "2 giờ trước" / "2 hours ago" theo locale */
function formatRelativeTime(iso: string, locale: string): string {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const diffMs = new Date(iso).getTime() - Date.now();
  const diffMin = Math.round(diffMs / 60000);
  const abs = Math.abs(diffMin);
  if (abs < 60) return rtf.format(diffMin, 'minute');
  const diffHour = Math.round(diffMin / 60);
  if (Math.abs(diffHour) < 24) return rtf.format(diffHour, 'hour');
  return rtf.format(Math.round(diffHour / 24), 'day');
}

/** Câu mô tả hoạt động theo type + payload */
function formatActivity(activity: CoupleActivity, actorName: string, t: TFunction): string {
  const count = typeof activity.payload?.count === 'number' ? activity.payload.count : 0;
  const title = typeof activity.payload?.title === 'string' ? activity.payload.title : '';
  switch (activity.type) {
    case 'memory_added':
      return t('home.activityText.memory_added', { actor: actorName });
    case 'photos_added':
      return t('home.activityText.photos_added', { actor: actorName, count });
    case 'challenge_complete':
      return t('home.activityText.challenge_complete', { actor: actorName });
    case 'milestone_reached':
      return t('home.activityText.milestone_reached', { title });
    default:
      return t('home.activityText.fallback', { actor: actorName });
  }
}

// Gradient placeholder cho ảnh kỷ niệm chưa có cover
const MEMORY_GRADIENTS = ['bg-[#e36a97]', 'bg-[#dd7e97]', 'bg-[#6fb0e8]'];

/** Gộp các page timeline → danh sách phẳng, lấy n kỷ niệm đầu */
function pickRecentMemories(timeline: { pages: MemoryTimeline[] } | undefined, n: number): Memory[] {
  return (timeline?.pages ?? [])
    .flatMap(page => page.groups)
    .flatMap(group => group.memories)
    .slice(0, n);
}

/** Tên hiển thị của cặp đôi từ user hiện tại + nickname partner */
function resolveCoupleNames(
  user: { name?: string; partnerNickname?: unknown } | null,
  fallbackName: string,
): { myName: string; partnerName: string; coupleNames: string } {
  const myName = user?.name ?? fallbackName;
  const partnerName = (user?.partnerNickname as string | undefined) ?? '';
  const coupleNames = partnerName ? `${myName} & ${partnerName}` : myName;
  return { myName, partnerName, coupleNames };
}

// ── Sub-components ──────────────────────────────────────────────────────────

interface HeaderProps {
  greeting: string;
  coupleNames: string;
  myName: string;
  partnerName: string;
  avatarUri?: string;
}

/** Header: lời chào + tên cặp đôi + avatar + logo */
function HomeHeader({ greeting, coupleNames, myName, partnerName, avatarUri }: HeaderProps) {
  return (
    <View className="flex-row items-center">
      <View className="flex-1">
        <Text className="text-body-sm font-medium text-text-muted">{greeting}</Text>
        <Text className="font-serif font-bold text-text" style={{ fontSize: 22, lineHeight: 28 }}>
          {coupleNames}
        </Text>
      </View>
      <AvatarPair
        left={{ name: myName, uri: avatarUri, color: 'accent' }}
        right={{ name: partnerName || '?', color: 'rose' }}
        size="sm"
      />
      <View className="ml-3 flex-row items-center gap-1.5">
        <View className="w-9 h-9 rounded-full bg-accent items-center justify-center">
          <Icon name="heart" size="sm" color="#FFFFFF" />
        </View>
        <Text className="font-serif italic text-text/70" style={{ fontSize: 16, letterSpacing: 1 }}>
          everly
        </Text>
      </View>
    </View>
  );
}

interface DaysCardProps {
  loading: boolean;
  days: number;
  locale: string;
  milestoneTarget?: number;
  remainingDays: number | null;
}

/** Card "cùng nhau được" — đếm số ngày bên nhau + pill cột mốc */
function DaysTogetherCard({ loading, days, locale, milestoneTarget, remainingDays }: DaysCardProps) {
  const { t } = useTranslation();
  return (
    <View className="bg-surface-alt rounded-lg px-5 py-7 items-center gap-2">
      <Text className="text-body-sm font-medium text-text-muted">{t('home.togetherLabel')}</Text>
      {loading ? (
        <Skeleton width={160} height={64} radius={12} className="my-1" />
      ) : (
        <Text className="font-serif font-bold text-accent" style={{ fontSize: 64, lineHeight: 72 }}>
          {days.toLocaleString(locale)}
        </Text>
      )}
      <View className="flex-row items-center gap-2">
        <Text className="font-serif font-medium text-text" style={{ fontSize: 20 }}>
          {t('home.daysUnit')}
        </Text>
        <Icon name="heart" size="md" color="var(--color-accent)" />
      </View>
      {milestoneTarget !== undefined && remainingDays !== null && (
        <TouchableOpacity
          className="flex-row items-center gap-2 bg-accent rounded-pill px-4 py-2 mt-1"
          activeOpacity={0.85}
        >
          <Icon name="award" size="xs" color="#FFFFFF" />
          <Text className="text-body-sm font-semibold text-on-accent">
            {t('home.milestonePill', {
              count: remainingDays,
              target: milestoneTarget.toLocaleString(locale),
            })}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

/** Lưới 3 kỷ niệm gần nhất */
function RecentMemories({ memories, loading }: { memories: Memory[]; loading: boolean }) {
  const { t } = useTranslation();
  // Trong lúc tải: hiện skeleton thay vì empty-state để tránh nháy
  if (loading) {
    return (
      <View className="flex-row gap-3">
        {[0, 1, 2].map(i => (
          <Skeleton key={i} width="100%" height={96} radius={12} className="flex-1" />
        ))}
      </View>
    );
  }
  if (memories.length === 0) {
    return <Text className="text-body-sm text-text-muted">{t('home.emptyMemories')}</Text>;
  }
  return (
    <View className="flex-row gap-3">
      {memories.map((memory, index) => (
        <TouchableOpacity
          key={memory.id}
          className="flex-1 bg-surface rounded-md overflow-hidden border-hairline border-border"
          activeOpacity={0.85}
        >
          {memory.coverUrl ? (
            <Image source={{ uri: memory.coverUrl }} className="h-24 w-full" resizeMode="cover" />
          ) : (
            <View className={`h-24 ${MEMORY_GRADIENTS[index % MEMORY_GRADIENTS.length]}`} />
          )}
          <View className="px-2 pt-1.5 pb-2 gap-0.5">
            <Text className="text-body-sm font-semibold text-text" numberOfLines={1}>
              {memory.title}
            </Text>
            {memory.tags[0] && (
              <Text className="text-label font-regular text-text-muted" numberOfLines={1}>
                #{memory.tags[0]}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

interface ActivityFeedProps {
  activities: CoupleActivity[];
  userId?: string;
  myName: string;
  partnerName: string;
  locale: string;
  loading: boolean;
}

/** Danh sách hoạt động gần đây */
function ActivityFeed({ activities, userId, myName, partnerName, locale, loading }: ActivityFeedProps) {
  const { t } = useTranslation();
  // Trong lúc tải: hiện skeleton thay vì empty-state để tránh nháy
  if (loading) {
    return (
      <View className="gap-3">
        {[0, 1].map(i => (
          <Skeleton key={i} width="100%" height={72} radius={12} />
        ))}
      </View>
    );
  }
  if (activities.length === 0) {
    return <Text className="text-body-sm text-text-muted">{t('home.emptyActivity')}</Text>;
  }
  return (
    <View className="gap-3">
      {activities.map(activity => {
        const actorName = activity.actorId === userId ? myName : partnerName || '?';
        return (
          <TouchableOpacity
            key={activity.id}
            className="flex-row items-center gap-3 bg-surface rounded-md border-hairline border-border p-4"
            activeOpacity={0.85}
          >
            <Avatar name={actorName} size="sm" color="rose" />
            <View className="flex-1 gap-0.5">
              <Text className="text-body-md font-medium text-text">
                {formatActivity(activity, actorName, t)}
              </Text>
              <Text className="text-body-sm text-text-muted">
                {formatRelativeTime(activity.createdAt, locale)}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ── Screen ──────────────────────────────────────────────────────────────────

export function HomeScreen() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
  const user = useValue(authStore$.user);

  const { data: stats, isLoading: statsLoading } = useCoupleStats();
  const { data: upcoming } = useUpcomingMilestones(1);
  const { data: timeline, isLoading: timelineLoading } = useMemoryTimeline();
  const { data: activities, isLoading: activitiesLoading } = useCoupleActivity({ limit: 5 });

  // Tên hiển thị: "Tôi & Partner"
  const { myName, partnerName, coupleNames } = resolveCoupleNames(user, t('home.defaultName'));

  const greeting = t(`home.${greetingKey(new Date().getHours())}`);

  // Cột mốc sắp tới gần nhất
  const nextMilestone = upcoming?.[0];
  const remainingDays = nextMilestone ? daysBetween(new Date(), new Date(nextMilestone.date)) : null;

  // 3 kỷ niệm gần nhất từ timeline
  const recentMemories = pickRecentMemories(timeline, 3);

  return (
    <Screen>
      <ScrollView className="flex-1" contentContainerClassName="px-5 pt-5 pb-32 gap-5">
        <HomeHeader
          greeting={greeting}
          coupleNames={coupleNames}
          myName={myName}
          partnerName={partnerName}
          avatarUri={user?.avatar as string | undefined}
        />

        <DaysTogetherCard
          loading={statsLoading}
          days={stats?.daysTogether ?? 0}
          locale={locale}
          milestoneTarget={nextMilestone?.daysOffset}
          remainingDays={remainingDays}
        />

        <SectionHeader title={t('home.recentMemories')} actionLabel={t('home.seeAll')} />
        <RecentMemories memories={recentMemories} loading={timelineLoading} />

        <SectionHeader title={t('home.activity')} actionLabel={t('home.seeAll')} />
        <ActivityFeed
          activities={activities ?? []}
          userId={user?.id}
          myName={myName}
          partnerName={partnerName}
          locale={locale}
          loading={activitiesLoading}
        />
      </ScrollView>
    </Screen>
  );
}
