import { describe, it, expect } from 'vitest';
import {
  indexToPosition,
  clampIndex,
  generateSnakesAndLadders,
} from '../src/engine/board';

describe('board mapping', () => {
  it('maps serpentine coordinates', () => {
    expect(indexToPosition(0, 100)).toEqual({ row: 0, col: 0 });
    expect(indexToPosition(9, 100)).toEqual({ row: 0, col: 9 });
    expect(indexToPosition(10, 100)).toEqual({ row: 1, col: 9 });
    expect(indexToPosition(19, 100)).toEqual({ row: 1, col: 0 });
    expect(indexToPosition(20, 100)).toEqual({ row: 2, col: 0 });
    expect(indexToPosition(29, 100)).toEqual({ row: 2, col: 9 });
    expect(indexToPosition(30, 100)).toEqual({ row: 3, col: 9 });
    expect(indexToPosition(39, 100)).toEqual({ row: 3, col: 0 });
    expect(indexToPosition(99, 100)).toEqual({ row: 9, col: 0 });
  });

  it('supports variable board sizes', () => {
    expect(indexToPosition(0, 64)).toEqual({ row: 0, col: 0 });
    expect(indexToPosition(7, 64)).toEqual({ row: 0, col: 7 });
    expect(indexToPosition(8, 64)).toEqual({ row: 1, col: 7 });
    expect(indexToPosition(15, 64)).toEqual({ row: 1, col: 0 });
  });

  it('clamps index', () => {
    expect(clampIndex(-5, 100)).toBe(0);
    expect(clampIndex(150, 100)).toBe(99);
  });

  it('generates snakes and ladders within bounds', () => {
    const { snakes, ladders } = generateSnakesAndLadders(64, 2, 2);
    for (const s of [...snakes, ...ladders]) {
      expect(s.from).toBeGreaterThan(0);
      expect(s.from).toBeLessThan(64);
      expect(s.to).toBeGreaterThanOrEqual(0);
      expect(s.to).toBeLessThan(64);
    }
  });
});
