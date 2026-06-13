import type { HttpClient } from '../../http';
import type { ICoupleDataSource } from './ICoupleDataSource';
import type {
  AcceptInviteRequestDto,
  CoupleActivityDto,
  CoupleDto,
  CoupleInviteDto,
  CoupleStatsDto,
  CreateInviteRequestDto,
  UpdateStartDateRequestDto,
  UpdateThemeRequestDto,
} from '../types/api.types';

export class HttpCoupleDataSource implements ICoupleDataSource {
  constructor(private readonly http: HttpClient) {}

  async getCouple(): Promise<CoupleDto> {
    const res = await this.http.get<CoupleDto>('/couple');
    return res.data;
  }

  async updateStartDate(startDate: string): Promise<CoupleDto> {
    const res = await this.http.put<CoupleDto, UpdateStartDateRequestDto>(
      '/couple/start-date',
      { start_date: startDate },
    );
    return res.data;
  }

  async updateTheme(theme: string): Promise<CoupleDto> {
    const res = await this.http.put<CoupleDto, UpdateThemeRequestDto>('/couple/theme', {
      theme,
    });
    return res.data;
  }

  async getStats(): Promise<CoupleStatsDto> {
    const res = await this.http.get<CoupleStatsDto>('/couple/stats');
    return res.data;
  }

  async getActivity(limit?: number, offset?: number): Promise<CoupleActivityDto[]> {
    const res = await this.http.get<CoupleActivityDto[]>('/couple/activity', {
      params: { limit, offset },
    });
    return res.data;
  }

  async createInvite(req?: CreateInviteRequestDto): Promise<CoupleInviteDto> {
    const res = await this.http.post<CoupleInviteDto>('/couple/invite', req);
    return res.data;
  }

  async getInvite(code: string): Promise<CoupleInviteDto> {
    const res = await this.http.get<CoupleInviteDto>(
      `/couple/invite/${encodeURIComponent(code)}`,
    );
    return res.data;
  }

  async acceptInvite(code: string, startDate: string): Promise<CoupleDto> {
    const res = await this.http.post<CoupleDto, AcceptInviteRequestDto>(
      `/couple/invite/${encodeURIComponent(code)}/accept`,
      { start_date: startDate },
    );
    return res.data;
  }
}
