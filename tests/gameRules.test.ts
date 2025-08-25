import { describe, it, expect, beforeAll } from 'vitest';
import { processTurn } from '../src/engine/gameRules';
import { defaultRules } from '../src/engine';
import { loadWordlist } from '../src/dictionary/loader';

let dict: Set<string>;

beforeAll(async () => {
  dict = await loadWordlist();
});

describe('game rules', () => {
  it('accepts valid word and moves', () => {
    const res = processTurn({
      word: 'apple',
      startLetter: 'a',
      requiredLength: 5,
      usedWords: new Set(),
      rules: defaultRules,
      lastDie: 0,
      position: 0,
      dictionary: dict,
      wildcards: 2,
    });
    expect(res.accepted).toBe(true);
    expect(res.position).toBe(5);
    expect(res.startLetter).toBe('e');
  });

  it('challenge mode moves back on invalid', () => {
    const res = processTurn({
      word: 'zzzzz',
      startLetter: 'a',
      requiredLength: 5,
      usedWords: new Set(),
      rules: { ...defaultRules, challengeMode: true },
      lastDie: 4,
      position: 8,
      dictionary: dict,
      wildcards: 2,
    });
    expect(res.accepted).toBe(false);
    expect(res.position).toBe(4);
  });
});
