export function selectRandomElements<T>(arr: T[], n: number): T[] {
  const shuffled = arr.slice().sort(() => 0.5 - Math.random());

  return shuffled.slice(0, n);
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}
