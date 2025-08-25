import { describe, expect, it } from 'vitest';
// Dictionary hint helper under test
import { getHints, Dictionary } from '../src/dictionary/loader';

describe('getHints', () => {
  const dict: Dictionary = new Set(['apple', 'angle', 'anchor', 'banana']);

  it('returns matching words up to the limit', () => {
    const hints = getHints(dict, 'a', 5, 2);
    expect(hints).toEqual(['apple', 'angle']);
  });

  it('returns empty array when none match', () => {
    const hints = getHints(dict, 'z', 5);
    expect(hints).toEqual([]);
  });
});
