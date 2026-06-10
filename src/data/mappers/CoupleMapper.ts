import type {
  CoupleActivityDto,
  CoupleDto,
  CoupleInviteDto,
  CoupleStatsDto,
} from '../types/api.types';
import type {
  Couple,
  CoupleActivity,
  CoupleActivityType,
  CoupleInvite,
  CoupleStats,
  CoupleTheme,
} from '@/domain/entities';

export function mapCouple(dto: CoupleDto): Couple {
  return {
    id: dto.id,
    user1Id: dto.user1_id,
    user2Id: dto.user2_id,
    startDate: dto.start_date,
    theme: dto.theme as CoupleTheme,
    isPro: dto.is_pro,
    proUntil: dto.pro_until,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

export function mapCoupleStats(dto: CoupleStatsDto): CoupleStats {
  return {
    daysTogether: dto.days_together,
    photoCount: dto.photo_count,
    memoryCount: dto.memory_count,
    milestoneCount: dto.milestone_count,
    challengeCount: dto.challenge_count,
  };
}

/** payload là base64 của JSONB bytes — decode best-effort. */
function decodePayload(payload: string): Record<string, unknown> | null {
  try {
    const atob = (globalThis as unknown as { atob: (s: string) => string }).atob;
    return JSON.parse(atob(payload)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function mapCoupleActivity(dto: CoupleActivityDto): CoupleActivity {
  return {
    id: dto.id,
    coupleId: dto.couple_id,
    actorId: dto.actor_id,
    type: dto.type as CoupleActivityType,
    payload: decodePayload(dto.payload),
    createdAt: dto.created_at,
  };
}

export function mapCoupleInvite(dto: CoupleInviteDto): CoupleInvite {
  return {
    id: dto.id,
    inviterId: dto.inviter_id,
    code: dto.code,
    expiresAt: dto.expires_at,
    acceptedAt: dto.accepted_at,
    acceptedBy: dto.accepted_by,
    createdAt: dto.created_at,
  };
}
