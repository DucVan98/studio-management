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
    onboardingStore$.relationshipStartDate.set(date.toISOString());
  },

  savePairingCode(code: PairingCode): void {
    onboardingStore$.pairingCode.set(code);
  },

  saveCoupleConnection(connection: CoupleConnection): void {
    onboardingStore$.coupleConnection.set(connection);
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
    });
  },

  getRelationshipStartDate(): Date | null {
    const iso = onboardingStore$.relationshipStartDate.peek();
    return iso ? new Date(iso) : null;
  },
};
