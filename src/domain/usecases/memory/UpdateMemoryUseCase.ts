import type { UseCase } from '../UseCase';
import type {
  IMemoryRepository,
  UpdateMemoryParams,
} from '../../repositories/IMemoryRepository';
import type { Memory } from '../../entities';
import { validateMemoryParams } from './validateMemoryParams';

export interface UpdateMemoryInput {
  id: string;
  params: UpdateMemoryParams;
}

export class UpdateMemoryUseCase implements UseCase<UpdateMemoryInput, Memory> {
  constructor(private readonly memoryRepository: IMemoryRepository) {}

  execute({ id, params }: UpdateMemoryInput): Promise<Memory> {
    validateMemoryParams(params);
    return this.memoryRepository.update(id, params);
  }
}
