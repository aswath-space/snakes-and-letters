import type { CellIndex, Rules } from './types';
import { clampIndex, resolveSnakesAndLadders } from './board';
import { normalize, validateWord } from './validate';
import type { Dictionary } from '../dictionary/loader';

interface SubmitWordArgs {
  word: string;
  useWildcard?: boolean;
  startLetter: string;
  requiredLength: number;
  usedWords: Set<string>;
  rules: Rules;
  lastDie: number;
  position: CellIndex;
  dictionary: Dictionary;
  wildcards: number;
}

interface SubmitWordResult {
  accepted: boolean;
  reason?: string;
  position: CellIndex;
  startLetter: string;
  usedWords: Set<string>;
  wildcards: number;
}

export function processTurn(args: SubmitWordArgs): SubmitWordResult {
  const normalized = normalize(args.word);
  const validation = validateWord(normalized, {
    length: args.requiredLength,
    startLetter: args.startLetter,
    usedWords: args.usedWords,
    hasWord: (w) => args.dictionary.has(w),
    noRepeats: args.rules.noRepeats,
    useWildcard: args.useWildcard,
  });
  if (!validation.accepted) {
    let pos = args.position;
    if (args.rules.challengeMode) {
      pos = clampIndex(pos - args.lastDie, args.rules.boardSize);
    }
    return {
      accepted: false,
      reason: validation.reason,
      position: pos,
      startLetter: args.startLetter,
      usedWords: args.usedWords,
      wildcards: args.wildcards,
    };
  }
  let pos = args.position + normalized.length;
  pos = clampIndex(pos, args.rules.boardSize);
  pos = resolveSnakesAndLadders(pos, args.rules);
  const used = new Set(args.usedWords);
  used.add(normalized);
  const wildcards = args.wildcards - (args.useWildcard ? 1 : 0);
  return {
    accepted: true,
    position: pos,
    startLetter: normalized.at(-1)!,
    usedWords: used,
    wildcards,
  };
}

