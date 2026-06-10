// ── Request / Response DTOs ────────────────────────────────────────────────────

export interface SaveProfileRequest {
  name: string;
  avatar_color?: string;
}

export interface GeneratePairingCodeResponse {
  code: string;
  expires_at: string; // ISO string
}

export interface ConnectPartnerResponse {
  couple_id: string;
  partner_id: string;
  partner_name: string;
  partner_avatar_color?: string;
}

export interface SaveRelationshipDateRequest {
  relationship_start_date: string; // ISO string
}

// ── Interface ──────────────────────────────────────────────────────────────────

export interface IOnboardingDataSource {
  saveProfile(profile: SaveProfileRequest): Promise<void>;
  generatePairingCode(): Promise<GeneratePairingCodeResponse>;
  connectPartner(code: string): Promise<ConnectPartnerResponse>;
  saveRelationshipDate(req: SaveRelationshipDateRequest): Promise<void>;
  completeOnboarding(): Promise<void>;
}
