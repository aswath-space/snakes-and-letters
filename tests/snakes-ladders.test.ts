import { describe, it, expect } from 'vitest';
import { resolveSnakesAndLadders } from '../src/engine/board';
import { Rules } from '../src/engine/types';

const chainRules: Rules = {
  boardSize: 100,
  snakes: [{ from: 22, to: 3 }],
  ladders: [{ from: 3, to: 22 }],
  allowWildcards: true,
  challengeMode: false,
  noRepeats: false,
  timer: false,
  hints: false,
};

const ladderRules: Rules = {
  boardSize: 100,
  snakes: [],
  ladders: [{ from: 4, to: 20 }],
  allowWildcards: true,
  challengeMode: false,
  noRepeats: false,
  timer: false,
  hints: false,
};

describe('resolveSnakesAndLadders', () => {
  it('returns same index when no snake or ladder', () => {
    expect(resolveSnakesAndLadders(10, chainRules)).toBe(10);
  });

  it('resolves a snake', () => {
    expect(resolveSnakesAndLadders(22, chainRules)).toBe(3);
  });

  it('resolves a ladder', () => {
    expect(resolveSnakesAndLadders(4, ladderRules)).toBe(20);
  });

  it('handles chains', () => {
    expect(resolveSnakesAndLadders(3, chainRules)).toBe(3);
  });
});
