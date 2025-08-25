interface AiParams {
  dictionary: Set<string>;
  length: number;
  startLetter: string;
  usedWords: Set<string>;
  noRepeats: boolean;
}

export function chooseRandomWord({
  dictionary,
  length,
  startLetter,
  usedWords,
  noRepeats,
}: AiParams): string | null {
  let candidates = Array.from(dictionary).filter(
    (w) => w.length === length && w.startsWith(startLetter)
  );
  if (noRepeats) {
    candidates = candidates.filter((w) => !usedWords.has(w));
  }
  if (candidates.length === 0) return null;
  const index = Math.floor(Math.random() * candidates.length);
  return candidates[index];
}
