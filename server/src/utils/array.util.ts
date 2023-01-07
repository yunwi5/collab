export function arraysEqual<T>(arr1: T[], arr2: T[]): boolean {
  return JSON.stringify([...arr1].sort()) === JSON.stringify([...arr2].sort());
}
