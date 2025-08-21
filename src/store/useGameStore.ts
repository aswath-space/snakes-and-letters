import { create } from 'zustand';
import {
  Rules,
  CellIndex,
  defaultRules,
  resolveSnakesAndLadders,
  clampIndex,
} from '../engine';
import { rollDie } from '../engine/dice';
import { validateWord } from '../engine/validate';
import type { Dictionary } from '../dictionary/loader';

export type PlayerId = 0 | 1;

interface GameState {
  rules: Rules;
  positions: Record<PlayerId, CellIndex>;
  current: PlayerId;
  lastDie: number;
  startLetter: string;
  usedWords: Set<string>;
  wildcards: Record<PlayerId, number>;
  requiredLength: number;
  dictionary: Dictionary;
  newGame(rules?: Partial<Rules>): void;
  roll(): void;
  submitWord(
    word: string,
    useWildcard?: boolean
  ): { accepted: boolean; reason?: string };
  endTurn(): void;
}

export const useGameStore = create<GameState>((set, get) => ({
  rules: defaultRules,
  positions: { 0: 0, 1: 0 },
  current: 0,
  lastDie: 0,
  startLetter: 'a',
  usedWords: new Set(),
  wildcards: { 0: 2, 1: 2 },
  requiredLength: 0,
  dictionary: new Set(),
  newGame(rules) {
    set({
      rules: { ...defaultRules, ...rules },
      positions: { 0: 0, 1: 0 },
      current: 0,
      lastDie: 0,
      startLetter: 'a',
      usedWords: new Set(),
      wildcards: { 0: 2, 1: 2 },
      requiredLength: 0,
    });
  },
  roll() {
    const die = rollDie();
    set({ lastDie: die, requiredLength: die });
  },
  submitWord(word, useWildcard = false) {
    const state = get();
    const validation = validateWord(word, {
      length: state.requiredLength,
      startLetter: state.startLetter,
      usedWords: state.usedWords,
      dictionary: state.dictionary,
      noRepeats: state.rules.noRepeats,
      useWildcard,
    });
    if (!validation.accepted) {
      if (state.rules.challengeMode) {
        let pos = state.positions[state.current] - state.lastDie;
        pos = clampIndex(pos, state.rules.boardSize);
        set({
          positions: { ...state.positions, [state.current]: pos },
        });
      }
      return validation;
    }
    let position = state.positions[state.current] + word.length;
    position = clampIndex(position, state.rules.boardSize);
    position = resolveSnakesAndLadders(position, state.rules);
    const newUsed = new Set(state.usedWords);
    newUsed.add(word.toLowerCase());
    const newWildcards = { ...state.wildcards };
    if (useWildcard) newWildcards[state.current]--;
    set({
      positions: { ...state.positions, [state.current]: position },
      startLetter: word.at(-1)!.toLowerCase(),
      usedWords: newUsed,
      wildcards: newWildcards,
    });
    return { accepted: true };
  },
  endTurn() {
    set((s) => ({
      current: s.current === 0 ? 1 : 0,
      requiredLength: 0,
    }));
  },
}));
