import type {
  CoupleActivityDto,
  CoupleDto,
  CoupleInviteDto,
  CoupleStatsDto,
} from '../types/api.types';

export interface ICoupleDataSource {
  getCouple(): Promise<CoupleDto>;
  updateStartDate(startDate: string): Promise<CoupleDto>;
  updateTheme(theme: string): Promise<CoupleDto>;
  getStats(): Promise<CoupleStatsDto>;
  getActivity(limit?: number, offset?: number): Promise<CoupleActivityDto[]>;
  createInvite(): Promise<CoupleInviteDto>;
  getInvite(code: string): Promise<CoupleInviteDto>;
  acceptInvite(code: string, startDate: string): Promise<CoupleDto>;
}
