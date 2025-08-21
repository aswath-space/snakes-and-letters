import { describe, it, expect } from 'vitest';
import { resolveSnakesAndLadders } from '../src/engine/board';
import { Rules } from '../src/engine/types';

const rules: Rules = {
  boardSize: 100,
  snakes: [{ from: 22, to: 3 }],
  ladders: [{ from: 3, to: 22 }],
  allowWildcards: true,
  challengeMode: false,
  noRepeats: false,
};

describe('snakes and ladders', () => {
  it('resolves simple snake', () => {
    expect(resolveSnakesAndLadders(22, rules)).toBe(3);
  });
  it('resolves ladder', () => {
    expect(resolveSnakesAndLadders(3, rules)).toBe(3); // ladder then snake back
  });
});
