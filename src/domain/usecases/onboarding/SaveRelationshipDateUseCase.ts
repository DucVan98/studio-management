import type { UseCase } from '../UseCase';
import type { IOnboardingRepository } from '../../repositories/IOnboardingRepository';
import { AppError } from '../../errors/AppError';

export interface SaveRelationshipDateInput {
  /** ISO string hoặc Date object */
  date: Date | string;
}

export class SaveRelationshipDateUseCase implements UseCase<SaveRelationshipDateInput, Date> {
  constructor(private readonly repo: IOnboardingRepository) {}

  async execute(input: SaveRelationshipDateInput): Promise<Date> {
    const date = typeof input.date === 'string' ? new Date(input.date) : input.date;

    if (isNaN(date.getTime())) throw new AppError('Ngày không hợp lệ', 'validation');
    if (date > new Date()) throw new AppError('Ngày bắt đầu không thể ở tương lai', 'validation');
    if (date < new Date('2000-01-01')) throw new AppError('Ngày bắt đầu quá xa trong quá khứ', 'validation');

    await this.repo.saveRelationshipDate(date);
    return date;
  }
}
