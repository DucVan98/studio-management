import { AuthHttpClient } from '../http';
import { SecureTokenStorage } from '../services/SecureTokenStorage';
import { AuthSessionService } from '../services/AuthSessionService';
import { InviteSSEClient } from '../services/InviteSSEClient';
import type { IInviteSSEClient } from '../services/InviteSSEClient';

// ── DataSources ───────────────────────────────────────────────────────────────
import { HttpAuthDataSource } from '../data/datasources/HttpAuthDataSource';
import { HttpCoupleDataSource } from '../data/datasources/HttpCoupleDataSource';
import { HttpMemoryDataSource } from '../data/datasources/HttpMemoryDataSource';
import { HttpMilestoneDataSource } from '../data/datasources/HttpMilestoneDataSource';
import { HttpNotificationDataSource } from '../data/datasources/HttpNotificationDataSource';
import { HttpSubscriptionDataSource } from '../data/datasources/HttpSubscriptionDataSource';

// ── Repositories ──────────────────────────────────────────────────────────────
import { HttpAuthRepository } from '../data/repositories/HttpAuthRepository';
import { HttpCoupleRepository } from '../data/repositories/HttpCoupleRepository';
import { HttpMemoryRepository } from '../data/repositories/HttpMemoryRepository';
import { HttpMilestoneRepository } from '../data/repositories/HttpMilestoneRepository';
import { HttpNotificationRepository } from '../data/repositories/HttpNotificationRepository';
import { HttpSubscriptionRepository } from '../data/repositories/HttpSubscriptionRepository';
import type { IAuthRepository } from '../domain/repositories/IAuthRepository';
import type { ICoupleRepository } from '../domain/repositories/ICoupleRepository';
import type { IMemoryRepository } from '../domain/repositories/IMemoryRepository';
import type { IMilestoneRepository } from '../domain/repositories/IMilestoneRepository';
import type { INotificationRepository } from '../domain/repositories/INotificationRepository';
import type { ISubscriptionRepository } from '../domain/repositories/ISubscriptionRepository';

// ── Use cases: Onboarding ─────────────────────────────────────────────────────
import { SaveProfileUseCase } from '../domain/usecases/onboarding/SaveProfileUseCase';
import { GeneratePairingCodeUseCase } from '../domain/usecases/onboarding/GeneratePairingCodeUseCase';
import { ConnectPartnerUseCase } from '../domain/usecases/onboarding/ConnectPartnerUseCase';
import { SaveRelationshipDateUseCase } from '../domain/usecases/onboarding/SaveRelationshipDateUseCase';
import { CompleteOnboardingUseCase } from '../domain/usecases/onboarding/CompleteOnboardingUseCase';

// ── DataSources: Onboarding ───────────────────────────────────────────────────
import { HttpOnboardingDataSource } from '../data/datasources/HttpOnboardingDataSource';

// ── Repositories: Onboarding ──────────────────────────────────────────────────
import { HttpOnboardingRepository } from '../data/repositories/HttpOnboardingRepository';
import type { IOnboardingRepository } from '../domain/repositories/IOnboardingRepository';

// ── Use cases: Auth ───────────────────────────────────────────────────────────
import { RegisterUseCase } from '../domain/usecases/auth/RegisterUseCase';
import { VerifyEmailUseCase } from '../domain/usecases/auth/VerifyEmailUseCase';
import { LoginUseCase } from '../domain/usecases/auth/LoginUseCase';
import { ForgotPasswordUseCase } from '../domain/usecases/auth/ForgotPasswordUseCase';
import { ResendOtpUseCase } from '../domain/usecases/auth/ResendOtpUseCase';
import { ResetPasswordUseCase } from '../domain/usecases/auth/ResetPasswordUseCase';
import { LogoutUseCase } from '../domain/usecases/auth/LogoutUseCase';

// ── Use cases: Couple ─────────────────────────────────────────────────────────
import { GetCoupleUseCase } from '../domain/usecases/couple/GetCoupleUseCase';
import { UpdateStartDateUseCase } from '../domain/usecases/couple/UpdateStartDateUseCase';
import { UpdateThemeUseCase } from '../domain/usecases/couple/UpdateThemeUseCase';
import { GetCoupleStatsUseCase } from '../domain/usecases/couple/GetCoupleStatsUseCase';
import { GetCoupleActivityUseCase } from '../domain/usecases/couple/GetCoupleActivityUseCase';
import { CreateInviteUseCase } from '../domain/usecases/couple/CreateInviteUseCase';
import { GetInviteUseCase } from '../domain/usecases/couple/GetInviteUseCase';
import { AcceptInviteUseCase } from '../domain/usecases/couple/AcceptInviteUseCase';

// ── Use cases: Memory ─────────────────────────────────────────────────────────
import { GetMemoryTimelineUseCase } from '../domain/usecases/memory/GetMemoryTimelineUseCase';
import { CreateMemoryUseCase } from '../domain/usecases/memory/CreateMemoryUseCase';
import { GetMemoryCalendarUseCase } from '../domain/usecases/memory/GetMemoryCalendarUseCase';
import { GetMemoriesByTagUseCase } from '../domain/usecases/memory/GetMemoriesByTagUseCase';
import { GetMemoryDetailUseCase } from '../domain/usecases/memory/GetMemoryDetailUseCase';
import { UpdateMemoryUseCase } from '../domain/usecases/memory/UpdateMemoryUseCase';
import { DeleteMemoryUseCase } from '../domain/usecases/memory/DeleteMemoryUseCase';
import { UploadMemoryMediaUseCase } from '../domain/usecases/memory/UploadMemoryMediaUseCase';
import { DeleteMemoryMediaUseCase } from '../domain/usecases/memory/DeleteMemoryMediaUseCase';

// ── Use cases: Milestone ──────────────────────────────────────────────────────
import { GetMilestonesUseCase } from '../domain/usecases/milestone/GetMilestonesUseCase';
import { GetUpcomingMilestonesUseCase } from '../domain/usecases/milestone/GetUpcomingMilestonesUseCase';
import { ReachMilestoneUseCase } from '../domain/usecases/milestone/ReachMilestoneUseCase';

// ── Use cases: Notification ───────────────────────────────────────────────────
import { GetNotificationsUseCase } from '../domain/usecases/notification/GetNotificationsUseCase';
import { MarkNotificationReadUseCase } from '../domain/usecases/notification/MarkNotificationReadUseCase';
import { MarkAllNotificationsReadUseCase } from '../domain/usecases/notification/MarkAllNotificationsReadUseCase';
import { DeleteNotificationUseCase } from '../domain/usecases/notification/DeleteNotificationUseCase';
import { RegisterDeviceTokenUseCase } from '../domain/usecases/notification/RegisterDeviceTokenUseCase';
import { UnregisterDeviceTokenUseCase } from '../domain/usecases/notification/UnregisterDeviceTokenUseCase';

// ── Use cases: Subscription ───────────────────────────────────────────────────
import { GetSubscriptionUseCase } from '../domain/usecases/subscription/GetSubscriptionUseCase';

/**
 * DIContainer — Singleton Dependency Injection theo Clean Architecture:
 *
 *   Screen → UseCase → Repository Interface ← Repository Impl → DataSource → HttpClient
 *
 * Token lifecycle được wire sẵn:
 * - AuthHttpClient tự gắn Bearer token, 401 → refresh → retry 1 lần
 * - AuthSessionService giữ token (SecureStore), single-flight refresh
 * - Refresh fail → session expired listener (đăng ký qua `onSessionExpired`)
 *
 * @example
 * const di = DIContainer.getInstance();
 * await di.session.restore();                       // app boot
 * const result = await di.getLoginUseCase().execute({ email, password });
 */
export class DIContainer {
  private static instance: DIContainer | null = null;

  readonly http: AuthHttpClient;
  readonly session: AuthSessionService;

  private _onboardingRepository?: IOnboardingRepository;
  private _authRepository?: IAuthRepository;
  private _coupleRepository?: ICoupleRepository;
  private _inviteSSEClient?: IInviteSSEClient;
  private _memoryRepository?: IMemoryRepository;
  private _milestoneRepository?: IMilestoneRepository;
  private _notificationRepository?: INotificationRepository;
  private _subscriptionRepository?: ISubscriptionRepository;

  protected constructor() {
    const host = process.env.EXPO_PUBLIC_API_URL ?? '';
    const baseURL = `${host.replace(/\/$/, '')}/api/v1`;

    this.session = new AuthSessionService(new SecureTokenStorage());
    this.http = new AuthHttpClient({ baseURL }, this.session);

    // Refresh executor inject sau khi http client sẵn sàng (tránh circular dep).
    // /auth/refresh là route public → không bị gắn token / retry loop.
    this.session.setRefreshExecutor(async refreshToken => {
      const { tokens } = await this.getAuthRepository().refresh(refreshToken);
      return tokens;
    });
  }

  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  static resetInstance(): void {
    DIContainer.instance = null;
  }

  /** Đăng ký callback khi session hết hạn (refresh fail) → navigate về login. */
  onSessionExpired(listener: () => void): () => void {
    return this.session.onSessionExpiredListener(listener);
  }

  // ── Repositories ──────────────────────────────────────────────────────────

  getOnboardingRepository(): IOnboardingRepository {
    this._onboardingRepository ??= new HttpOnboardingRepository(
      new HttpOnboardingDataSource(this.http),
    );
    return this._onboardingRepository;
  }

  getAuthRepository(): IAuthRepository {
    this._authRepository ??= new HttpAuthRepository(new HttpAuthDataSource(this.http));
    return this._authRepository;
  }

  getCoupleRepository(): ICoupleRepository {
    this._coupleRepository ??= new HttpCoupleRepository(new HttpCoupleDataSource(this.http));
    return this._coupleRepository;
  }

  getMemoryRepository(): IMemoryRepository {
    this._memoryRepository ??= new HttpMemoryRepository(new HttpMemoryDataSource(this.http));
    return this._memoryRepository;
  }

  getMilestoneRepository(): IMilestoneRepository {
    this._milestoneRepository ??= new HttpMilestoneRepository(
      new HttpMilestoneDataSource(this.http),
    );
    return this._milestoneRepository;
  }

  getNotificationRepository(): INotificationRepository {
    this._notificationRepository ??= new HttpNotificationRepository(
      new HttpNotificationDataSource(this.http),
    );
    return this._notificationRepository;
  }

  getSubscriptionRepository(): ISubscriptionRepository {
    this._subscriptionRepository ??= new HttpSubscriptionRepository(
      new HttpSubscriptionDataSource(this.http),
    );
    return this._subscriptionRepository;
  }

  // ── Services ──────────────────────────────────────────────────────────────

  getInviteSSEClient(): IInviteSSEClient {
    const host = process.env.EXPO_PUBLIC_API_URL ?? '';
    const baseURL = `${host.replace(/\/$/, '')}/api/v1`;
    this._inviteSSEClient ??= new InviteSSEClient(
      baseURL,
      () => this.session.getAccessToken(),
    );
    return this._inviteSSEClient;
  }

  // ── Auth Use Cases ────────────────────────────────────────────────────────

  getRegisterUseCase() { return new RegisterUseCase(this.getAuthRepository()); }
  getVerifyEmailUseCase() { return new VerifyEmailUseCase(this.getAuthRepository(), this.session); }
  getLoginUseCase() { return new LoginUseCase(this.getAuthRepository(), this.session); }
  getForgotPasswordUseCase() { return new ForgotPasswordUseCase(this.getAuthRepository()); }
  getResendOtpUseCase() { return new ResendOtpUseCase(this.getAuthRepository()); }
  getResetPasswordUseCase() { return new ResetPasswordUseCase(this.getAuthRepository()); }
  getLogoutUseCase() {
    return new LogoutUseCase(
      this.getAuthRepository(),
      this.getNotificationRepository(),
      this.session,
    );
  }

  // ── Couple Use Cases ──────────────────────────────────────────────────────

  getGetCoupleUseCase() { return new GetCoupleUseCase(this.getCoupleRepository()); }
  getUpdateStartDateUseCase() { return new UpdateStartDateUseCase(this.getCoupleRepository()); }
  getUpdateThemeUseCase() { return new UpdateThemeUseCase(this.getCoupleRepository()); }
  getGetCoupleStatsUseCase() { return new GetCoupleStatsUseCase(this.getCoupleRepository()); }
  getGetCoupleActivityUseCase() { return new GetCoupleActivityUseCase(this.getCoupleRepository()); }
  getCreateInviteUseCase() { return new CreateInviteUseCase(this.getCoupleRepository()); }
  getGetInviteUseCase() { return new GetInviteUseCase(this.getCoupleRepository()); }
  getAcceptInviteUseCase() { return new AcceptInviteUseCase(this.getCoupleRepository(), this.session); }

  // ── Memory Use Cases ──────────────────────────────────────────────────────

  getGetMemoryTimelineUseCase() { return new GetMemoryTimelineUseCase(this.getMemoryRepository()); }
  getCreateMemoryUseCase() { return new CreateMemoryUseCase(this.getMemoryRepository()); }
  getGetMemoryCalendarUseCase() { return new GetMemoryCalendarUseCase(this.getMemoryRepository()); }
  getGetMemoriesByTagUseCase() { return new GetMemoriesByTagUseCase(this.getMemoryRepository()); }
  getGetMemoryDetailUseCase() { return new GetMemoryDetailUseCase(this.getMemoryRepository()); }
  getUpdateMemoryUseCase() { return new UpdateMemoryUseCase(this.getMemoryRepository()); }
  getDeleteMemoryUseCase() { return new DeleteMemoryUseCase(this.getMemoryRepository()); }
  getUploadMemoryMediaUseCase() { return new UploadMemoryMediaUseCase(this.getMemoryRepository()); }
  getDeleteMemoryMediaUseCase() { return new DeleteMemoryMediaUseCase(this.getMemoryRepository()); }

  // ── Milestone Use Cases ───────────────────────────────────────────────────

  getGetMilestonesUseCase() { return new GetMilestonesUseCase(this.getMilestoneRepository()); }
  getGetUpcomingMilestonesUseCase() { return new GetUpcomingMilestonesUseCase(this.getMilestoneRepository()); }
  getReachMilestoneUseCase() { return new ReachMilestoneUseCase(this.getMilestoneRepository()); }

  // ── Notification Use Cases ────────────────────────────────────────────────

  getGetNotificationsUseCase() { return new GetNotificationsUseCase(this.getNotificationRepository()); }
  getMarkNotificationReadUseCase() { return new MarkNotificationReadUseCase(this.getNotificationRepository()); }
  getMarkAllNotificationsReadUseCase() { return new MarkAllNotificationsReadUseCase(this.getNotificationRepository()); }
  getDeleteNotificationUseCase() { return new DeleteNotificationUseCase(this.getNotificationRepository()); }
  getRegisterDeviceTokenUseCase() { return new RegisterDeviceTokenUseCase(this.getNotificationRepository()); }
  getUnregisterDeviceTokenUseCase() { return new UnregisterDeviceTokenUseCase(this.getNotificationRepository()); }

  // ── Subscription Use Cases ────────────────────────────────────────────────

  getGetSubscriptionUseCase() { return new GetSubscriptionUseCase(this.getSubscriptionRepository()); }

  // ── Onboarding Use Cases ──────────────────────────────────────────────────

  getSaveProfileUseCase() { return new SaveProfileUseCase(this.getOnboardingRepository()); }
  getGeneratePairingCodeUseCase() { return new GeneratePairingCodeUseCase(this.getOnboardingRepository()); }
  getConnectPartnerUseCase() { return new ConnectPartnerUseCase(this.getOnboardingRepository()); }
  getSaveRelationshipDateUseCase() { return new SaveRelationshipDateUseCase(this.getOnboardingRepository()); }
  getCompleteOnboardingUseCase() { return new CompleteOnboardingUseCase(this.getOnboardingRepository()); }
}
