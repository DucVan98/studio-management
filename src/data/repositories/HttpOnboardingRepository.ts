import type { IOnboardingRepository } from '../../domain/repositories/IOnboardingRepository';
import type {
  OnboardingProfile,
  PairingCode,
  CoupleConnection,
} from '../../domain/entities/Onboarding.entity';
import type { IOnboardingDataSource } from '../datasources/IOnboardingDataSource';
import { guard } from '../mappers/ErrorMapper';

export class HttpOnboardingRepository implements IOnboardingRepository {
  constructor(private readonly dataSource: IOnboardingDataSource) {}

  saveProfile(profile: OnboardingProfile): Promise<void> {
    return guard(() =>
      this.dataSource.saveProfile({ name: profile.name, avatar_color: profile.avatarColor }),
    );
  }

  generatePairingCode(): Promise<PairingCode> {
    return guard(async () => {
      const res = await this.dataSource.generatePairingCode();
      return { code: res.code, expiresAt: new Date(res.expires_at) };
    });
  }

  connectPartner(code: string): Promise<CoupleConnection> {
    return guard(async () => {
      const res = await this.dataSource.connectPartner(code);
      return {
        coupleId: res.couple_id,
        partnerId: res.partner_id,
        partnerName: res.partner_name,
        partnerAvatarColor: res.partner_avatar_color,
      };
    });
  }

  saveRelationshipDate(date: Date): Promise<void> {
    return guard(() =>
      this.dataSource.saveRelationshipDate({ relationship_start_date: date.toISOString() }),
    );
  }

  completeOnboarding(): Promise<void> {
    return guard(() => this.dataSource.completeOnboarding());
  }
}
