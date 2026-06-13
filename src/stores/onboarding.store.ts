import { observable } from '@legendapp/state';
import { configurePersistence } from './persistence/mmkv.adapter';
import type {
  OnboardingProfile,
  PairingCode,
  CoupleConnection,
} from '../domain/entities/Onboarding.entity';

// ── Types ─────────────────────────────────────────────────────────────────────

/** Loại cột mốc ngày bắt đầu (map với 3 Pill tabs trong Figma) */
export type DateType = 'love' | 'wedding' | 'first_met';

export interface OnboardingState {
  isCompleted: boolean;
  profile: OnboardingProfile | null;
  partnerNickname: string | null;
  dateType: DateType;
  /** ISO string — MMKV không serialize Date */
  relationshipStartDate: string | null;
  pairingCode: PairingCode | null;
  coupleConnection: CoupleConnection | null;
  /** Mã mời nhận từ deep link khi user chưa đăng nhập — xử lý lại sau khi auth xong */
  pendingInviteCode: string | null;
}

// ── Date helpers ────────────────────────────────────────────────────────────────

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Serialize một Date thành ngày lịch `YYYY-MM-DD` theo GIỜ ĐỊA PHƯƠNG.
 * KHÔNG dùng toISOString() — nó quy về UTC, nên ở timezone UTC+ (vd VN +07:00)
 * sẽ đẩy lùi ngày đúng 1 ngày. relationshipStartDate là calendar date, không
 * phải một thời điểm cụ thể.
 */
const DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/;

export function toLocalDateStr(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * Chuẩn hoá giá trị đã persist về `YYYY-MM-DD`. Chấp nhận:
 * - chuỗi date-only (mới) → dùng nguyên
 * - chuỗi full-ISO hoặc Date cũ còn sót trong MMKV → parse rồi format local,
 *   tránh crash "x.slice is not a function".
 */
export function normalizeToDateStr(value: unknown): string | null {
  if (typeof value === 'string' && DATE_ONLY_RE.test(value)) return value;
  if (value == null) return null;
  const d = new Date(value as string | number | Date);
  return Number.isNaN(d.getTime()) ? null : toLocalDateStr(d);
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const onboardingStore$ = observable<OnboardingState>({
  isCompleted: false,
  profile: null,
  partnerNickname: null,
  dateType: 'love',
  relationshipStartDate: null,
  pairingCode: null,
  coupleConnection: null,
  pendingInviteCode: null,
});

configurePersistence(onboardingStore$, 'onboarding');

// ── Actions ───────────────────────────────────────────────────────────────────

export const onboardingActions = {
  saveProfile(profile: OnboardingProfile): void {
    onboardingStore$.profile.set(profile);
  },

  setPartnerNickname(nickname: string): void {
    onboardingStore$.partnerNickname.set(nickname);
  },

  setDateType(type: DateType): void {
    onboardingStore$.dateType.set(type);
  },

  saveRelationshipDate(date: Date): void {
    onboardingStore$.relationshipStartDate.set(toLocalDateStr(date));
  },

  savePairingCode(code: PairingCode): void {
    onboardingStore$.pairingCode.set(code);
  },

  saveCoupleConnection(connection: CoupleConnection): void {
    onboardingStore$.coupleConnection.set(connection);
  },

  setPendingInviteCode(code: string | null): void {
    onboardingStore$.pendingInviteCode.set(code);
  },

  getPendingInviteCode(): string | null {
    return onboardingStore$.pendingInviteCode.peek();
  },

  complete(): void {
    onboardingStore$.isCompleted.set(true);
  },

  reset(): void {
    onboardingStore$.set({
      isCompleted: false,
      profile: null,
      partnerNickname: null,
      dateType: 'love',
      relationshipStartDate: null,
      pairingCode: null,
      coupleConnection: null,
      pendingInviteCode: null,
    });
  },

  /** Trả ngày bắt đầu dạng `YYYY-MM-DD` (đã chuẩn hoá local, an toàn với data cũ). */
  getRelationshipStartDate(): string | null {
    return normalizeToDateStr(onboardingStore$.relationshipStartDate.peek());
  },
};
