import type { UseCase } from '../UseCase';
import type { CreateInviteInput, ICoupleRepository } from '../../repositories/ICoupleRepository';
import type { CoupleInvite } from '../../entities';

/** Tạo invite code (hết hạn 7 ngày). Đã có couple → AppError kind 'conflict'. */
export class CreateInviteUseCase implements UseCase<CreateInviteInput | undefined, CoupleInvite> {
  constructor(private readonly coupleRepository: ICoupleRepository) {}

  execute(input?: CreateInviteInput): Promise<CoupleInvite> {
    return this.coupleRepository.createInvite(input);
  }
}
