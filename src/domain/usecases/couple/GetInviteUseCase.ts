import type { UseCase } from '../UseCase';
import type { ICoupleRepository } from '../../repositories/ICoupleRepository';
import type { CoupleInvite } from '../../entities';

/** Preview invite trước khi accept (màn hình accept). */
export class GetInviteUseCase implements UseCase<string, CoupleInvite> {
  constructor(private readonly coupleRepository: ICoupleRepository) {}

  execute(code: string): Promise<CoupleInvite> {
    return this.coupleRepository.getInvite(code);
  }
}
