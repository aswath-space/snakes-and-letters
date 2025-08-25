// Parameters used by the simple AI to select a word
interface AiParams {
  dictionary: Set<string>;
  length: number;
  startLetter: string;
  usedWords: Set<string>;
  noRepeats: boolean;
}

// Randomly choose a valid word for the AI
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
