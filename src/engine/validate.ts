import { Dictionary, hasWord } from '../dictionary/loader';

export function normalize(word: string): string {
  return word.trim().toLowerCase();
}

interface Options {
  length: number;
  startLetter: string;
  usedWords: Set<string>;
  dictionary: Dictionary;
  noRepeats?: boolean;
  useWildcard?: boolean;
}

export function validateWord(
  word: string,
  opts: Options
): { accepted: boolean; reason?: string } {
  const w = normalize(word);
  if (w.length !== opts.length) {
    return { accepted: false, reason: 'length' };
  }
  if (!opts.useWildcard) {
    if (!w.startsWith(opts.startLetter.toLowerCase())) {
      return { accepted: false, reason: 'start' };
    }
  }
  if (!hasWord(opts.dictionary, w)) {
    return { accepted: false, reason: 'dictionary' };
  }
  if (opts.noRepeats && opts.usedWords.has(w)) {
    return { accepted: false, reason: 'repeat' };
  }
  return { accepted: true };
}

export function canSatisfy(
  letter: string,
  length: number,
  dict: Dictionary
): boolean {
  const lower = letter.toLowerCase();
  for (const word of dict) {
    if (word.length === length && word.startsWith(lower)) return true;
  }
  return false;
}
