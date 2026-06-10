import type { HttpClient } from '../../http';
import type { ISubscriptionDataSource } from './ISubscriptionDataSource';
import type { SubscriptionDto } from '../types/api.types';

export class HttpSubscriptionDataSource implements ISubscriptionDataSource {
  constructor(private readonly http: HttpClient) {}

  async getSubscription(): Promise<SubscriptionDto> {
    const res = await this.http.get<SubscriptionDto>('/subscription');
    return res.data;
  }
}
