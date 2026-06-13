// ============================================================================
// Raw API DTOs — mirror docs/API.md (Everly backend, June 2026)
// snake_case, đúng wire format. KHÔNG dùng trực tiếp ở UI — map sang entities.
// ============================================================================

// ── Common ────────────────────────────────────────────────────────────────────

/** Mọi lỗi: { message }. Riêng 500 có thêm code. */
export interface ApiErrorDto {
  message: string;
  code?: string;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface UserDto {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  partner_nickname?: string;
  oauth_provider?: string;
  email_verified: boolean;
  couple_id?: string;
  created_at: string;
  updated_at: string;
}

export interface TokenPairDto {
  access_token: string;
  refresh_token: string;
  expires_at: string;
  user: UserDto;
}

export interface RegisterRequestDto {
  email: string;
  password: string;
  name: string;
}

export interface RegisterResponseDto {
  user_id: string;
  message: string;
}

export interface VerifyEmailRequestDto {
  user_id: string;
  code: string;
}

export interface ResendOtpRequestDto {
  user_id: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface RefreshRequestDto {
  refresh_token: string;
}

export interface ForgotPasswordRequestDto {
  email: string;
}

export interface ForgotPasswordResponseDto {
  message: string;
}

export interface ResetPasswordRequestDto {
  user_id: string;
  code: string;
  new_password: string;
}

// ── Couple ────────────────────────────────────────────────────────────────────

export interface CoupleDto {
  id: string;
  user1_id: string;
  user2_id: string;
  start_date: string;
  theme: string;
  is_pro: boolean;
  pro_until?: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateStartDateRequestDto {
  start_date: string; // YYYY-MM-DD
}

export interface UpdateThemeRequestDto {
  theme: string;
}

export interface CoupleStatsDto {
  days_together: number;
  photo_count: number;
  memory_count: number;
  milestone_count: number;
  challenge_count: number;
}

export interface CoupleActivityDto {
  id: string;
  couple_id: string;
  actor_id: string;
  type: string;
  payload: string; // base64 JSONB bytes
  created_at: string;
}

export interface CoupleInviteDto {
  id: string;
  inviter_id: string;
  /** Tên người mời — backend embed vào response của GET /invite/:code */
  inviter_name?: string;
  code: string;
  expires_at: string;
  accepted_at?: string;
  accepted_by?: string;
  created_at: string;
}

export interface AcceptInviteRequestDto {
  start_date: string; // YYYY-MM-DD
}

// ── Memory ────────────────────────────────────────────────────────────────────

export interface MediaDto {
  id: string;
  memory_id: string;
  couple_id: string;
  type: 'image' | 'video';
  url: string;
  thumb_url?: string;
  size_bytes: number;
  width: number;
  height: number;
  duration: number;
  sort_order: number;
  created_at: string;
}

export interface MemoryDto {
  id: string;
  couple_id: string;
  created_by_id: string;
  title: string;
  note?: string;
  memory_date: string;
  location_name?: string;
  latitude?: number;
  longitude?: number;
  cover_url?: string;
  media_count: number;
  tags?: string[];
  media?: MediaDto[]; // absent trong list
  created_at: string;
  updated_at: string;
}

export interface TimelineGroupDto {
  year: number;
  month: number;
  label: string;
  memories: MemoryDto[];
}

export interface TimelineResponseDto {
  data: TimelineGroupDto[];
  total: number;
}

export interface MemoryListResponseDto {
  data: MemoryDto[];
  total: number;
}

export interface CalendarDayDto {
  date: string; // YYYY-MM-DD
  memory_count: number;
}

export interface CreateMemoryRequestDto {
  title: string;
  note?: string;
  memory_date: string; // YYYY-MM-DD
  location_name?: string;
  latitude?: number;
  longitude?: number;
  tags?: string[];
}

export type UpdateMemoryRequestDto = Partial<CreateMemoryRequestDto>;

// ── Milestone ─────────────────────────────────────────────────────────────────

export interface MilestoneDto {
  id: string;
  couple_id: string;
  type: 'system' | 'custom';
  title: string;
  date: string;
  days_offset: number;
  icon: string;
  is_reached: boolean;
  reached_at?: string;
  created_at: string;
}

export interface MilestoneListResponseDto {
  milestones: MilestoneDto[];
  total: number;
}

export interface UpcomingMilestonesResponseDto {
  milestones: MilestoneDto[];
}

// ── Notification ──────────────────────────────────────────────────────────────

export interface NotificationDto {
  id: string;
  user_id: string;
  couple_id?: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

export interface NotificationListResponseDto {
  notifications: NotificationDto[];
  unread_count: number;
}

export interface RegisterDeviceTokenRequestDto {
  token: string;
  platform: 'fcm' | 'apns';
}

export interface DeviceTokenDto {
  id: string;
  user_id: string;
  token: string;
  platform: string;
  created_at: string;
  updated_at: string;
}

// ── Subscription ──────────────────────────────────────────────────────────────

export interface SubscriptionDto {
  is_pro: boolean;
  plan: string;
  status: string;
  pro_until?: string;
  provider_sub_id?: string;
}
