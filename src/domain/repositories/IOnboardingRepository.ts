import type {
  OnboardingProfile,
  PairingCode,
  CoupleConnection,
} from '../entities/Onboarding.entity';

export interface IOnboardingRepository {
  /** Lưu profile người dùng (name, avatar) */
  saveProfile(profile: OnboardingProfile): Promise<void>;

  /** Tạo invite code để gửi cho partner */
  generatePairingCode(): Promise<PairingCode>;

  /** Nhập code của partner để kết nối đôi */
  connectPartner(code: string): Promise<CoupleConnection>;

  /** Lưu ngày bắt đầu mối quan hệ */
  saveRelationshipDate(date: Date): Promise<void>;

  /** Đánh dấu onboarding hoàn thành trên server */
  completeOnboarding(): Promise<void>;
}
