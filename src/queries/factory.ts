import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
  type QueryKey,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';
import { DIContainer } from '../di/DIContainer';
import type { UseCase } from '../domain/usecases/UseCase';
import type { AppError } from '../domain/errors/AppError';

/**
 * Generic hook factory — cầu nối giữa React Query (presentation) và use case
 * (domain). Mỗi endpoint chỉ cần khai báo 1 dòng, không phải viết hook tay:
 *
 * @example
 * export const useCouple = createQuery(
 *   queryKeys.couple.detail(),
 *   di => di.getGetCoupleUseCase(),
 * );
 *
 * export const useCreateMemory = createMutation(
 *   di => di.getCreateMemoryUseCase(),
 *   { invalidates: [queryKeys.memories.all, queryKeys.couple.all] },
 * );
 */

type Selector<TInput, TOutput> = (di: DIContainer) => UseCase<TInput, TOutput>;

/** Options screen được phép override per-call */
export interface QueryOpts {
  enabled?: boolean;
  staleTime?: number;
  refetchInterval?: number;
}

// ── Queries ───────────────────────────────────────────────────────────────────

/** Query không có input — key tĩnh. */
export function createQuery<TOutput>(
  queryKey: QueryKey,
  select: Selector<void, TOutput>,
) {
  return function useGeneratedQuery(
    options?: QueryOpts,
  ): UseQueryResult<TOutput, AppError> {
    return useQuery<TOutput, AppError>({
      queryKey,
      queryFn: () => select(DIContainer.getInstance()).execute(undefined as void),
      ...options,
    });
  };
}

/** Query có input — key sinh từ input để cache theo từng param. */
export function createParamQuery<TInput, TOutput>(
  keyFn: (input: TInput) => QueryKey,
  select: Selector<TInput, TOutput>,
) {
  return function useGeneratedParamQuery(
    input: TInput,
    options?: QueryOpts,
  ): UseQueryResult<TOutput, AppError> {
    return useQuery<TOutput, AppError>({
      queryKey: keyFn(input),
      queryFn: () => select(DIContainer.getInstance()).execute(input),
      ...options,
    });
  };
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export interface MutationConfig<TInput, TOutput> {
  /** Keys bị invalidate sau khi mutation thành công (refetch active queries) */
  invalidates?: QueryKey[] | ((output: TOutput, input: TInput) => QueryKey[]);
  /** Side-effect tuỳ biến thêm (vd: clear toàn bộ cache khi logout) */
  onSuccess?: (
    queryClient: QueryClient,
    output: TOutput,
    input: TInput,
  ) => void | Promise<void>;
}

export function createMutation<TInput, TOutput>(
  select: Selector<TInput, TOutput>,
  config?: MutationConfig<TInput, TOutput>,
) {
  return function useGeneratedMutation(): UseMutationResult<TOutput, AppError, TInput> {
    const queryClient = useQueryClient();

    return useMutation<TOutput, AppError, TInput>({
      mutationFn: input => select(DIContainer.getInstance()).execute(input),
      onSuccess: async (output, input) => {
        const keys =
          typeof config?.invalidates === 'function'
            ? config.invalidates(output, input)
            : (config?.invalidates ?? []);
        await Promise.all(
          keys.map(queryKey => queryClient.invalidateQueries({ queryKey })),
        );
        await config?.onSuccess?.(queryClient, output, input);
      },
    });
  };
}
