export class InterceptorManager<T> {
  private readonly handlers: (T | undefined)[] = [];

  use(handler: T): number {
    this.handlers.push(handler);
    return this.handlers.length - 1;
  }

  eject(id: number): void {
    this.handlers[id] = undefined;
  }

  forEach(fn: (handler: T) => void): void {
    this.handlers.forEach(h => h && fn(h));
  }

  getAll(): T[] {
    return this.handlers.filter((h): h is T => h !== undefined);
  }
}
