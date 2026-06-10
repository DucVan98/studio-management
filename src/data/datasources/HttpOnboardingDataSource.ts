import type { HttpClient } from '../../http';
import type {
  IOnboardingDataSource,
  SaveProfileRequest,
  GeneratePairingCodeResponse,
  ConnectPartnerResponse,
  SaveRelationshipDateRequest,
} from './IOnboardingDataSource';

export class HttpOnboardingDataSource implements IOnboardingDataSource {
  constructor(private readonly http: HttpClient) {}

  async saveProfile(profile: SaveProfileRequest): Promise<void> {
    await this.http.post('/onboarding/profile', profile);
  }

  async generatePairingCode(): Promise<GeneratePairingCodeResponse> {
    const res = await this.http.post<GeneratePairingCodeResponse>('/onboarding/pairing-code', {});
    return res.data;
  }

  async connectPartner(code: string): Promise<ConnectPartnerResponse> {
    const res = await this.http.post<ConnectPartnerResponse>('/onboarding/connect', { code });
    return res.data;
  }

  async saveRelationshipDate(req: SaveRelationshipDateRequest): Promise<void> {
    await this.http.post('/onboarding/relationship-date', req);
  }

  async completeOnboarding(): Promise<void> {
    await this.http.post('/onboarding/complete', {});
  }
}
