import { create } from 'zustand';
import { Rules, CellIndex, defaultRules } from '../engine';
import { rollDie } from '../engine/dice';
import { processTurn } from '../engine/gameRules';
import { useDictionaryStore } from './dictionaryStore';

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
  newGame(rules) {
    set({
      rules: { ...defaultRules, ...rules },
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
    const dict = useDictionaryStore.getState().dictionary;
    const res = processTurn({
      word,
      useWildcard,
      startLetter: state.startLetter,
      requiredLength: state.requiredLength,
      usedWords: state.usedWords,
      rules: state.rules,
      lastDie: state.lastDie,
      position: state.positions[state.current],
      dictionary: dict,
      wildcards: state.wildcards[state.current],
    });
    set({
      positions: { ...state.positions, [state.current]: res.position },
      startLetter: res.startLetter,
      usedWords: res.usedWords,
      wildcards: { ...state.wildcards, [state.current]: res.wildcards },
    });
    return { accepted: res.accepted, reason: res.reason };
  },
  endTurn() {
    set((s) => ({
      current: s.current === 0 ? 1 : 0,
      requiredLength: 0,
    }));
  },
}));

