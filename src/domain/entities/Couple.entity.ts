export const FREE_THEMES = ['rose', 'sky', 'paper'] as const;
export const PRO_THEMES = ['midnight', 'garden', 'lavender'] as const;

export type CoupleTheme =
  | (typeof FREE_THEMES)[number]
  | (typeof PRO_THEMES)[number];

export function isProTheme(theme: CoupleTheme): boolean {
  return (PRO_THEMES as readonly string[]).includes(theme);
}

export interface Couple {
  id: string;
  user1Id: string;
  user2Id: string;
  startDate: string;
  theme: CoupleTheme;
  isPro: boolean;
  proUntil?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CoupleStats {
  daysTogether: number;
  photoCount: number;
  memoryCount: number;
  milestoneCount: number;
  challengeCount: number;
}

export type CoupleActivityType =
  | 'memory_added'
  | 'photos_added'
  | 'challenge_complete'
  | 'milestone_reached';

export interface CoupleActivity {
  id: string;
  coupleId: string;
  actorId: string;
  type: CoupleActivityType;
  /** Decoded từ base64 JSONB; null nếu payload không parse được */
  payload: Record<string, unknown> | null;
  createdAt: string;
}

export interface CoupleInvite {
  id: string;
  inviterId: string;
  /** Tên người mời — có khi gọi GET /invite/:code */
  inviterName?: string;
  /** Avatar người mời — có khi gọi GET /invite/:code */
  inviterAvatarUrl?: string;
  code: string;
  expiresAt: string;
  acceptedAt?: string;
  acceptedBy?: string;
  createdAt: string;
  /** Ngày User1 đã chọn — backend trả về sau khi fix POST /invites */
  startDate?: string;
  /** Loại cột mốc User1 chọn */
  dateType?: 'love' | 'wedding' | 'first-meet';
}
