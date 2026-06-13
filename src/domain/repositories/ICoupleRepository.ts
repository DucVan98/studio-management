import type {
  Couple,
  CoupleActivity,
  CoupleInvite,
  CoupleStats,
  CoupleTheme,
} from '../entities';

export interface ActivityQuery {
  /** default 20, max 50 */
  limit?: number;
  offset?: number;
}

export interface CreateInviteInput {
  /** Ngày User1 chọn ở màn StartDate — YYYY-MM-DD */
  startDate?: string;
  /** Loại cột mốc: "love" | "wedding" | "first-meet" */
  dateType?: string;
}

export interface ICoupleRepository {
  /** GET /couple */
  getCouple(): Promise<Couple>;
  /** PUT /couple/start-date — date YYYY-MM-DD */
  updateStartDate(startDate: string): Promise<Couple>;
  /** PUT /couple/theme — theme Pro cần Couple Pro (402 PRO_REQUIRED) */
  updateTheme(theme: CoupleTheme): Promise<Couple>;
  /** GET /couple/stats */
  getStats(): Promise<CoupleStats>;
  /** GET /couple/activity */
  getActivity(query?: ActivityQuery): Promise<CoupleActivity[]>;
  /** POST /couple/invite — gửi kèm startDate/dateType để backend embed vào SSE payload */
  createInvite(input?: CreateInviteInput): Promise<CoupleInvite>;
  /** GET /couple/invite/:code — preview trước khi accept */
  getInvite(code: string): Promise<CoupleInvite>;
  /** POST /couple/invite/:code/accept — sau đó PHẢI refresh token */
  acceptInvite(code: string, startDate: string): Promise<Couple>;
}
