import { describe, it, expect, beforeAll } from 'vitest';
import { validateWord, canSatisfy } from '../src/engine/validate';
import { loadWordlist, hasWord } from '../src/dictionary/loader';

let dict: Set<string>;
const hw = (w: string) => hasWord(dict, w);
const cs = (l: string, len: number) => canSatisfy(l, len, dict);

beforeAll(async () => {
  dict = await loadWordlist();
});

describe('validateWord', () => {
  it('accepts valid word', () => {
    const res = validateWord('apple', {
      length: 5,
      startLetter: 'a',
      usedWords: new Set(),
      hasWord: hw,
      canSatisfy: cs,
      noRepeats: false,
    });
    expect(res.accepted).toBe(true);
  });

  it('rejects wrong length', () => {
    const res = validateWord('apple', {
      length: 4,
      startLetter: 'a',
      usedWords: new Set(),
      hasWord: hw,
      canSatisfy: cs,
      noRepeats: false,
    });
    expect(res.accepted).toBe(false);
    expect(res.reason).toBe('length');
  });

  it('rejects start letter unless wildcard', () => {
    const res = validateWord('apple', {
      length: 5,
      startLetter: 'b',
      usedWords: new Set(),
      hasWord: hw,
      canSatisfy: cs,
      noRepeats: false,
    });
    expect(res.accepted).toBe(false);
    const res2 = validateWord('apple', {
      length: 5,
      startLetter: 'b',
      usedWords: new Set(),
      hasWord: hw,
      canSatisfy: cs,
      noRepeats: false,
      useWildcard: true,
    });
    expect(res2.accepted).toBe(true);
  });

  it('rejects repeat when noRepeats', () => {
    const used = new Set(['apple']);
    const res = validateWord('apple', {
      length: 5,
      startLetter: 'a',
      usedWords: used,
      hasWord: hw,
      canSatisfy: cs,
      noRepeats: true,
    });
    expect(res.accepted).toBe(false);
    expect(res.reason).toBe('repeat');
  });
});
