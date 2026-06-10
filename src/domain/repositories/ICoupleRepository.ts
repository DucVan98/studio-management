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
  /** POST /couple/invite — hết hạn sau 7 ngày */
  createInvite(): Promise<CoupleInvite>;
  /** GET /couple/invite/:code — preview trước khi accept */
  getInvite(code: string): Promise<CoupleInvite>;
  /** POST /couple/invite/:code/accept — sau đó PHẢI refresh token */
  acceptInvite(code: string, startDate: string): Promise<Couple>;
}
