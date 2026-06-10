import type { UseCase } from '../UseCase';
import type { ICoupleRepository } from '../../repositories/ICoupleRepository';
import type { ISessionManager } from '../../repositories/ISessionManager';
import type { Couple } from '../../entities';
import { AppError } from '../../errors/AppError';

export interface AcceptInviteParams {
  code: string;
  startDate: string; // YYYY-MM-DD
}

/**
 * Accept invite → tạo couple. Theo docs, sau khi accept PHẢI refresh token
 * để JWT mới có `cid` — nếu không mọi route cần couple sẽ trả 403.
 * Use case này tự refresh sau khi accept thành công.
 */
export class AcceptInviteUseCase implements UseCase<AcceptInviteParams, Couple> {
  constructor(
    private readonly coupleRepository: ICoupleRepository,
    private readonly session: ISessionManager,
  ) {}

  async execute(params: AcceptInviteParams): Promise<Couple> {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(params.startDate)) {
      throw new AppError('Start date must be YYYY-MM-DD', 'validation');
    }
    const couple = await this.coupleRepository.acceptInvite(params.code, params.startDate);
    await this.session.refreshAccessToken();
    return couple;
  }
}
