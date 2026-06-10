import type { UseCase } from '../UseCase';
import type { ICoupleRepository } from '../../repositories/ICoupleRepository';
import type { CoupleInvite } from '../../entities';

/** Tạo invite code (hết hạn 7 ngày). Đã có couple → AppError kind 'conflict'. */
export class CreateInviteUseCase implements UseCase<void, CoupleInvite> {
  constructor(private readonly coupleRepository: ICoupleRepository) {}

  execute(): Promise<CoupleInvite> {
    return this.coupleRepository.createInvite();
  }
}
