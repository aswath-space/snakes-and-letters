import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { useGameStore } from '../src/store/useGameStore';
import { useDictionaryStore } from '../src/store/dictionaryStore';

beforeAll(async () => {
  await useDictionaryStore.getState().load();
});

beforeEach(() => {
  useGameStore.getState().newGame();
  useGameStore.setState({ startLetter: 'a' });
});

describe('game store', () => {
  it('roll sets required length', () => {
    useGameStore.getState().roll();
    const { lastDie, requiredLength } = useGameStore.getState();
    expect(lastDie).toBeGreaterThanOrEqual(1);
    expect(lastDie).toBeLessThanOrEqual(6);
    expect(requiredLength).toBe(lastDie);
  });

  it('submit valid word moves player and updates start letter', () => {
    useGameStore.setState({ requiredLength: 5 });
    const res = useGameStore.getState().submitWord('apple');
    expect(res.accepted).toBe(true);
    expect(useGameStore.getState().positions[0]).toBe(5);
    expect(useGameStore.getState().startLetter).toBe('e');
  });

  it('wildcard bypasses start letter and decrements', () => {
    useGameStore.setState({ requiredLength: 5, startLetter: 'b' });
    const res = useGameStore.getState().submitWord('apple', true);
    expect(res.accepted).toBe(true);
    expect(useGameStore.getState().wildcards[0]).toBe(1);
  });

  it('rejects word with wrong start letter', () => {
    useGameStore.setState({ requiredLength: 5, startLetter: 'a' });
    const res = useGameStore.getState().submitWord('bread');
    expect(res.accepted).toBe(false);
    expect(useGameStore.getState().positions[0]).toBe(0);
  });

  it('challenge mode moves back on invalid', () => {
    useGameStore.setState({
      rules: { ...useGameStore.getState().rules, challengeMode: true },
      requiredLength: 5,
      lastDie: 4,
      startLetter: 'a',
      positions: { 0: 8, 1: 0 },
    });
    const res = useGameStore.getState().submitWord('zzzzz');
    expect(res.accepted).toBe(false);
    expect(useGameStore.getState().positions[0]).toBe(4);
  });

  it('endTurn switches player', () => {
    useGameStore.getState().endTurn();
    expect(useGameStore.getState().current).toBe(1);
  });
});
