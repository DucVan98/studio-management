export interface OnboardingProfile {
  /** Tên hiển thị */
  name: string;
  /** Màu avatar (khi chưa có ảnh) */
  avatarColor?: string;
}

export interface PairingCode {
  /** 6-ký-tự code để gửi cho partner */
  code: string;
  expiresAt: Date;
}

export interface CoupleConnection {
  coupleId: string;
  partnerId: string;
  partnerName: string;
  partnerAvatarColor?: string;
}

/** Toàn bộ dữ liệu tích lũy qua các bước onboarding. */
export interface OnboardingData {
  profile: OnboardingProfile | null;
  relationshipStartDate: Date | null;
  pairingCode: PairingCode | null;
  coupleConnection: CoupleConnection | null;
}

export type OnboardingStep = 'welcome' | 'profile' | 'partner' | 'date' | 'complete';

export const ONBOARDING_STEPS: OnboardingStep[] = [
  'welcome', 'profile', 'partner', 'date', 'complete',
];

export function nextOnboardingStep(current: OnboardingStep): OnboardingStep | null {
  const idx = ONBOARDING_STEPS.indexOf(current);
  return idx < ONBOARDING_STEPS.length - 1 ? ONBOARDING_STEPS[idx + 1] : null;
}