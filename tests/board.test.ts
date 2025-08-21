import { describe, it, expect } from 'vitest';
import { indexToPosition, clampIndex } from '../src/engine/board';

describe('board mapping', () => {
  it('maps serpentine coordinates', () => {
    expect(indexToPosition(0, 100)).toEqual({ row: 0, col: 0 });
    expect(indexToPosition(9, 100)).toEqual({ row: 0, col: 9 });
    expect(indexToPosition(10, 100)).toEqual({ row: 1, col: 9 });
    expect(indexToPosition(19, 100)).toEqual({ row: 1, col: 0 });
  });

  it('clamps index', () => {
    expect(clampIndex(-5, 100)).toBe(0);
    expect(clampIndex(150, 100)).toBe(99);
  });
});
