import type { UseCase } from '../UseCase';
import type { ICoupleRepository } from '../../repositories/ICoupleRepository';
import type { Couple } from '../../entities';

export class GetCoupleUseCase implements UseCase<void, Couple> {
  constructor(private readonly coupleRepository: ICoupleRepository) {}

  execute(): Promise<Couple> {
    return this.coupleRepository.getCouple();
  }
}
