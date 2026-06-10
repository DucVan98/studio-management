import type { UseCase } from '../UseCase';
import type {
  CreateMemoryParams,
  IMemoryRepository,
} from '../../repositories/IMemoryRepository';
import type { Memory } from '../../entities';
import { validateMemoryParams } from './validateMemoryParams';

export class CreateMemoryUseCase implements UseCase<CreateMemoryParams, Memory> {
  constructor(private readonly memoryRepository: IMemoryRepository) {}

  execute(params: CreateMemoryParams): Promise<Memory> {
    validateMemoryParams(params);
    return this.memoryRepository.create(params);
  }
}
