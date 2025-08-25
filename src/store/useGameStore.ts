import { create } from 'zustand';
import {
  Rules,
  CellIndex,
  defaultRules,
  resolveSnakesAndLadders,
  clampIndex,
  generateSnakesAndLadders,
} from '../engine';
import { rollDie } from '../engine/dice';
import { validateWord, normalize } from '../engine/validate';
import { hasWord } from '../dictionary/loader';
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
  setDictionary(dict: Dictionary): void;
  newGame(rules?: Partial<Rules>): void;
  roll(): void;
  submitWord(
    word: string,
    useWildcard?: boolean,
  ): { accepted: boolean; reason?: string };
  endTurn(): void;
}

export const useGameStore = create<GameState>((set, get) => ({
  rules: defaultRules,
  positions: { 0: 0, 1: 0 },
  current: 0,
  lastDie: 0,
  startLetter: String.fromCharCode(97 + Math.floor(Math.random() * 26)),
  usedWords: new Set(),
  wildcards: { 0: 2, 1: 2 },
  requiredLength: 0,
  dictionary: new Set(),
  setDictionary(dict) {
    set({ dictionary: dict });
  },
  newGame(rules) {
    const merged: Rules = { ...defaultRules, ...rules };
    merged.boardSize = merged.rows * merged.cols;
    if (merged.randomSnakes) {
      const gen = generateSnakesAndLadders(merged.rows, merged.cols);
      merged.snakes = gen.snakes;
      merged.ladders = gen.ladders;
    }
    set({
      rules: merged,
      positions: { 0: 0, 1: 0 },
      current: 0,
      lastDie: 0,
      startLetter: String.fromCharCode(97 + Math.floor(Math.random() * 26)),
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
    const normalized = normalize(word);
    const validation = validateWord(normalized, {
      length: state.requiredLength,
      startLetter: state.startLetter,
      usedWords: state.usedWords,
      hasWord: (w) => hasWord(state.dictionary, w),
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
    let position = state.positions[state.current] + normalized.length;
    position = clampIndex(position, state.rules.boardSize);
    position = resolveSnakesAndLadders(position, state.rules);
    const newUsed = new Set(state.usedWords);
    newUsed.add(normalized);
    const newWildcards = { ...state.wildcards };
    if (useWildcard) newWildcards[state.current]--;
    set({
      positions: { ...state.positions, [state.current]: position },
      startLetter: normalized.at(-1)!,
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
