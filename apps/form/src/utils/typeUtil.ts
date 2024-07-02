export const includes = <T>(
  arr: T[] | readonly T[],
  value: unknown
): value is T => arr.includes(value as T);
