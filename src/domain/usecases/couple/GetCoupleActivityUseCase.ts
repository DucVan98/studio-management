import type { UseCase } from '../UseCase';
import type {
  ActivityQuery,
  ICoupleRepository,
} from '../../repositories/ICoupleRepository';
import type { CoupleActivity } from '../../entities';

export class GetCoupleActivityUseCase
  implements UseCase<ActivityQuery | undefined, CoupleActivity[]>
{
  constructor(private readonly coupleRepository: ICoupleRepository) {}

  execute(query?: ActivityQuery): Promise<CoupleActivity[]> {
    return this.coupleRepository.getActivity(query);
  }
}
