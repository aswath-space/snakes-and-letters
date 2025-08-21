import { describe, it, expect, beforeAll } from 'vitest';
import { validateWord } from '../src/engine/validate';
import { loadWordlist } from '../src/dictionary/loader';

let dict: Set<string>;

beforeAll(async () => {
  dict = await loadWordlist();
});

describe('validateWord', () => {
  it('accepts valid word', () => {
    const res = validateWord('apple', {
      length: 5,
      startLetter: 'a',
      usedWords: new Set(),
      dictionary: dict,
      noRepeats: false,
    });
    expect(res.accepted).toBe(true);
  });

  it('rejects wrong length', () => {
    const res = validateWord('apple', {
      length: 4,
      startLetter: 'a',
      usedWords: new Set(),
      dictionary: dict,
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
      dictionary: dict,
      noRepeats: false,
    });
    expect(res.accepted).toBe(false);
    const res2 = validateWord('apple', {
      length: 5,
      startLetter: 'b',
      usedWords: new Set(),
      dictionary: dict,
      noRepeats: false,
      useWildcard: true,
    });
    expect(res2.accepted).toBe(true);
  });

  it('rejects words missing from dictionary', () => {
    const res = validateWord('zzzzz', {
      length: 5,
      startLetter: 'z',
      usedWords: new Set(),
      dictionary: dict,
      noRepeats: false,
    });
    expect(res.accepted).toBe(false);
    expect(res.reason).toBe('dictionary');
  });

  it('rejects repeat when noRepeats', () => {
    const used = new Set(['apple']);
    const res = validateWord('apple', {
      length: 5,
      startLetter: 'a',
      usedWords: used,
      dictionary: dict,
      noRepeats: true,
    });
    expect(res.accepted).toBe(false);
    expect(res.reason).toBe('repeat');
  });
});
