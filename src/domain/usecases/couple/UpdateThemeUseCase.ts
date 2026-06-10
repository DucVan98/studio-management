import type { UseCase } from '../UseCase';
import type { ICoupleRepository } from '../../repositories/ICoupleRepository';
import type { Couple, CoupleTheme } from '../../entities';

/** Theme Pro mà chưa có Pro → server trả 402, AppError.kind = 'pro_required'. */
export class UpdateThemeUseCase implements UseCase<CoupleTheme, Couple> {
  constructor(private readonly coupleRepository: ICoupleRepository) {}

  execute(theme: CoupleTheme): Promise<Couple> {
    return this.coupleRepository.updateTheme(theme);
  }
}
