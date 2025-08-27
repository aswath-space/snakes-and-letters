// Parameters used by the simple AI to select a word
interface AiParams {
  dictionary: Set<string>;
  length: number;
  startLetter: string;
  usedWords: Set<string>;
  noRepeats: boolean;
}

// Choose a word for the bot based on skill level
export function chooseBotWord(
  skill: 'easy' | 'normal' | 'hard',
  { dictionary, length, startLetter, usedWords, noRepeats }: AiParams,
): string | null {
  // Placeholder for future skill-based strategies
  switch (skill) {
    case 'easy':
      // TODO: implement easy skill behavior
      break;
    case 'normal':
      // TODO: implement normal skill behavior
      break;
    case 'hard':
      // TODO: implement hard skill behavior
      break;
  }

  let candidates = Array.from(dictionary).filter(
    (w) => w.length === length && w.startsWith(startLetter),
  );
  if (noRepeats) {
    candidates = candidates.filter((w) => !usedWords.has(w));
  }
  if (candidates.length === 0) return null;
  const index = Math.floor(Math.random() * candidates.length);
  return candidates[index];
}
