import type { ICoupleDataSource } from '../datasources/ICoupleDataSource';
import type {
  ActivityQuery,
  CreateInviteInput,
  ICoupleRepository,
} from '../../domain/repositories/ICoupleRepository';
import type {
  Couple,
  CoupleActivity,
  CoupleInvite,
  CoupleStats,
  CoupleTheme,
} from '../../domain/entities';
import {
  mapCouple,
  mapCoupleActivity,
  mapCoupleInvite,
  mapCoupleStats,
} from '../mappers/CoupleMapper';
import { guard } from '../mappers/ErrorMapper';

export class HttpCoupleRepository implements ICoupleRepository {
  constructor(private readonly dataSource: ICoupleDataSource) {}

  getCouple(): Promise<Couple> {
    return guard(async () => mapCouple(await this.dataSource.getCouple()));
  }

  updateStartDate(startDate: string): Promise<Couple> {
    return guard(async () => mapCouple(await this.dataSource.updateStartDate(startDate)));
  }

  updateTheme(theme: CoupleTheme): Promise<Couple> {
    return guard(async () => mapCouple(await this.dataSource.updateTheme(theme)));
  }

  getStats(): Promise<CoupleStats> {
    return guard(async () => mapCoupleStats(await this.dataSource.getStats()));
  }

  getActivity(query?: ActivityQuery): Promise<CoupleActivity[]> {
    return guard(async () => {
      const dtos = await this.dataSource.getActivity(query?.limit, query?.offset);
      return dtos.map(mapCoupleActivity);
    });
  }

  createInvite(input?: CreateInviteInput): Promise<CoupleInvite> {
    return guard(async () => mapCoupleInvite(await this.dataSource.createInvite(
      input ? { start_date: input.startDate, date_type: input.dateType } : undefined,
    )));
  }

  getInvite(code: string): Promise<CoupleInvite> {
    return guard(async () => mapCoupleInvite(await this.dataSource.getInvite(code)));
  }

  acceptInvite(code: string, startDate: string): Promise<Couple> {
    return guard(async () => mapCouple(await this.dataSource.acceptInvite(code, startDate)));
  }
}
