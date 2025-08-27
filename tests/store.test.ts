import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
// State store and helpers under test
import { useGameStore } from '../src/store/useGameStore';
import { loadWordlist } from '../src/dictionary/loader';
import * as diceModule from '../src/engine/dice';
import * as aiModule from '../src/engine/ai';

let dict: Set<string>;

beforeAll(async () => {
  dict = await loadWordlist();
});

beforeEach(() => {
  useGameStore.getState().newGame();
  useGameStore.setState({ dictionary: dict, startLetter: 'a' });
});

describe('game store', () => {
  it('roll sets required length after finish', () => {
    useGameStore.getState().roll();
    let state = useGameStore.getState();
    expect(state.rolling).toBe(true);
    expect(state.requiredLength).toBe(0);
    useGameStore.getState().finishRoll();
    state = useGameStore.getState();
    expect(state.lastDie).toBeGreaterThanOrEqual(3);
    expect(state.lastDie).toBeLessThanOrEqual(6);
    expect(state.requiredLength).toBe(state.lastDie);
    expect(state.rolling).toBe(false);
  });

  it('submit valid word moves player and updates start letter', () => {
    useGameStore.setState({ requiredLength: 5 });
    const res = useGameStore.getState().submitWord('apple');
    expect(res.accepted).toBe(true);
    expect(useGameStore.getState().positions[0]).toBe(4);
    expect(useGameStore.getState().startLetter).toBe('e');
  });

  it('next word starts on last letter of previous word', () => {
    useGameStore.setState({ requiredLength: 5 });
    useGameStore.getState().submitWord('apple');
    useGameStore.setState({ requiredLength: 4 });
    const res = useGameStore.getState().submitWord('evil');
    expect(res.accepted).toBe(true);
    const state = useGameStore.getState();
    expect(state.positions[0]).toBe(14); // ladder from 7 to 14
    expect(state.boardLetters.slice(0, 8)).toEqual([
      'a',
      'p',
      'p',
      'l',
      'e',
      'v',
      'i',
      'l',
    ]);
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
    expect(useGameStore.getState().positions[0]).toBe(-1);
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

  it('zen mode keeps turn with player 1', () => {
    useGameStore.getState().newGame({ mode: 'zen' });
    useGameStore.getState().endTurn();
    expect(useGameStore.getState().current).toBe(0);
  });

  it('identifies winner and prevents further moves', () => {
    useGameStore.getState().newGame({ boardSize: 10, snakes: [], ladders: [] });
    useGameStore.setState({
      dictionary: dict,
      requiredLength: 10,
      startLetter: 'a',
    });
    const res = useGameStore.getState().submitWord('abandoning');
    expect(res.accepted).toBe(true);
    const state = useGameStore.getState();
    expect(state.positions[0]).toBe(9);
    expect(state.winner).toBe(0);
    const prev = useGameStore.getState().lastDie;
    useGameStore.getState().roll();
    expect(useGameStore.getState().lastDie).toBe(prev);
    useGameStore.getState().endTurn();
    expect(useGameStore.getState().current).toBe(0);
  });

  it('AI plays automatically in bot mode', () => {
    useGameStore.getState().newGame({ mode: 'bot' });
    useGameStore.setState({ dictionary: dict, startLetter: 'a' });
    const rollSpy = vi.spyOn(diceModule, 'rollDie').mockReturnValue(5);
    const aiSpy = vi.spyOn(aiModule, 'chooseBotWord').mockReturnValue('apple');
    useGameStore.getState().endTurn();
    expect(aiSpy).toHaveBeenCalled();
    expect(useGameStore.getState().positions[1]).toBe(4);
    expect(useGameStore.getState().startLetter).toBe('e');
    expect(useGameStore.getState().current).toBe(0);
    rollSpy.mockRestore();
    aiSpy.mockRestore();
  });

  it('passes selected bot skill to chooseBotWord', () => {
    useGameStore.getState().newGame({ mode: 'bot' });
    useGameStore.setState({ dictionary: dict, startLetter: 'a' });
    useGameStore.getState().setBot({ name: 'Cora', skill: 'hard' });
    const rollSpy = vi.spyOn(diceModule, 'rollDie').mockReturnValue(5);
    const aiSpy = vi.spyOn(aiModule, 'chooseBotWord').mockReturnValue('apple');
    useGameStore.getState().endTurn();
    expect(aiSpy).toHaveBeenCalledWith(
      'hard',
      expect.objectContaining({ length: 5 }),
    );
    rollSpy.mockRestore();
    aiSpy.mockRestore();
  });
});
