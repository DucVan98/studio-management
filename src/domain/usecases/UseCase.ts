/** Contract chung cho mọi use case (Interface Segregation: 1 method duy nhất). */
export interface UseCase<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>;
}
