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
import { chooseRandomWord } from '../engine/ai';
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
  boardLetters: string[];
  setDictionary(dict: Dictionary): void;
  newGame(rules?: Partial<Rules>): void;
  roll(): void;
  submitWord(
    word: string,
    useWildcard?: boolean,
  ): { accepted: boolean; reason?: string };
  endTurn(): void;
  muted: boolean;
  toggleMute(): void;
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
  boardLetters: Array(defaultRules.boardSize).fill(''),
  muted: false,
  setDictionary(dict) {
    set({ dictionary: dict });
  },
  newGame(rules) {
    const merged: Rules = { ...defaultRules, ...rules };
    if (
      rules?.boardSize &&
      rules.boardSize !== defaultRules.boardSize &&
      !rules.snakes &&
      !rules.ladders
    ) {
      const generated = generateSnakesAndLadders(rules.boardSize);
      merged.snakes = generated.snakes;
      merged.ladders = generated.ladders;
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
      boardLetters: Array(merged.boardSize).fill(''),
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
    const letters = [...state.boardLetters];
    for (let i = 0; i < normalized.length; i++) {
      const idx = state.positions[state.current] + i + 1;
      if (idx < letters.length) letters[idx] = normalized[i];
    }
    set({
      positions: { ...state.positions, [state.current]: position },
      startLetter: normalized.at(-1)!,
      usedWords: newUsed,
      wildcards: newWildcards,
      boardLetters: letters,
    });
    return { accepted: true };
  },
  endTurn() {
    const state = get();
    if (state.rules.mode === 'zen') {
      set({ requiredLength: 0 });
      return;
    }
    set({ current: state.current === 0 ? 1 : 0, requiredLength: 0 });
    const after = get();
    if (after.rules.mode === 'bot' && after.current === 1) {
      get().roll();
      const aiState = get();
      const word = chooseRandomWord({
        dictionary: aiState.dictionary,
        length: aiState.requiredLength,
        startLetter: aiState.startLetter,
        usedWords: aiState.usedWords,
        noRepeats: aiState.rules.noRepeats,
      });
      if (word) {
        get().submitWord(word);
      }
      set({ current: 0, requiredLength: 0 });
    }
  },
  toggleMute() {
    set((s) => ({ muted: !s.muted }));
  },
}));
