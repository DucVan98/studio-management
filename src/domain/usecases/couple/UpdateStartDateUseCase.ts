import type { UseCase } from '../UseCase';
import type { ICoupleRepository } from '../../repositories/ICoupleRepository';
import type { Couple } from '../../entities';
import { AppError } from '../../errors/AppError';

export class UpdateStartDateUseCase implements UseCase<string, Couple> {
  constructor(private readonly coupleRepository: ICoupleRepository) {}

  execute(startDate: string): Promise<Couple> {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
      throw new AppError('Start date must be YYYY-MM-DD', 'validation');
    }
    return this.coupleRepository.updateStartDate(startDate);
  }
}
