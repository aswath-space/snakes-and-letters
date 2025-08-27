import { create } from 'zustand';
// Core engine helpers and types
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

const TURN_TIME = 30; // seconds per turn when timer is enabled

export type PlayerId = 0 | 1;

// State and actions managed by Zustand
interface GameState {
  rules: Rules;
  positions: Record<PlayerId, CellIndex>;
  current: PlayerId;
  lastDie: number;
  startLetter: string;
  usedWords: Set<string>;
  wildcards: Record<PlayerId, number>;
  requiredLength: number;
  rolling: boolean;
  dictionary: Dictionary;
  boardLetters: string[];
  winner: PlayerId | null;
  remainingTime: number;
  decrementTimer(): void;
  setDictionary(dict: Dictionary): void;
  newGame(rules?: Partial<Rules>): void;
  roll(): void;
  finishRoll(): void;
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
  positions: { 0: -1, 1: -1 },
  current: 0,
  lastDie: 0,
  startLetter: String.fromCharCode(97 + Math.floor(Math.random() * 26)),
  usedWords: new Set(),
  wildcards: { 0: 2, 1: 2 },
  requiredLength: 0,
  rolling: false,
  dictionary: new Set(),
  boardLetters: Array(defaultRules.boardSize).fill(''),
  winner: null,
  remainingTime: 0,
  muted: false,
  setDictionary(dict) {
    set({ dictionary: dict });
  },
  // Start a new game optionally overriding rules
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
      positions: { 0: -1, 1: -1 },
      current: 0,
      lastDie: 0,
      startLetter: String.fromCharCode(97 + Math.floor(Math.random() * 26)),
      usedWords: new Set(),
      wildcards: { 0: 2, 1: 2 },
      requiredLength: 0,
      boardLetters: Array(merged.boardSize).fill(''),
      winner: null,
      remainingTime: 0,
      rolling: false,
    });
    get().roll();
  },
  // Roll the die to determine required word length
  roll() {
    if (get().winner !== null) return;
    const die = rollDie();
    set({
      lastDie: die,
      requiredLength: 0,
      rolling: true,
      remainingTime: get().rules.timer ? TURN_TIME : 0,
    });
  },
  finishRoll() {
    if (!get().rolling) return;
    set({ requiredLength: get().lastDie, rolling: false });
  },
  // Validate and apply a submitted word
  submitWord(word, useWildcard = false) {
    const state = get();
    if (state.winner !== null) {
      return { accepted: false, reason: 'game-over' };
    }
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
        pos = Math.max(pos, -1);
        set({
          positions: { ...state.positions, [state.current]: pos },
        });
      }
      return validation;
    }
    // Move forward placing the first letter on the current cell so the last
    // letter of one word is the starting square for the next. Players start
    // off-board at index -1, in which case the entire word determines the
    // movement. Once on the board, only the trailing letters beyond the first
    // advance the position.
    const move =
      state.positions[state.current] === -1
        ? normalized.length
        : normalized.length - 1;
    const remaining =
      state.rules.boardSize - 1 - state.positions[state.current];
    if (move > remaining) {
      get().endTurn();
      return { accepted: false, reason: 'overshoot' };
    }
    let position = state.positions[state.current] + move;
    position = clampIndex(position, state.rules.boardSize);
    position = resolveSnakesAndLadders(position, state.rules);
    const newUsed = new Set(state.usedWords);
    newUsed.add(normalized);
    const newWildcards = { ...state.wildcards };
    if (useWildcard) newWildcards[state.current]--;
    const letters = [...state.boardLetters];
    // Place letters starting on the current cell so the first letter overlaps
    // the previous word's last letter and the final letter lands on the
    // destination cell.
    const startIdx = Math.max(state.positions[state.current], 0);
    for (let i = 0; i < normalized.length; i++) {
      const idx = startIdx + i;
      if (idx < letters.length) letters[idx] = normalized[i];
    }
    const win = position === state.rules.boardSize - 1;
    set({
      positions: { ...state.positions, [state.current]: position },
      startLetter: normalized.at(-1)!,
      usedWords: newUsed,
      wildcards: newWildcards,
      boardLetters: letters,
      ...(win ? { winner: state.current } : {}),
    });
    return { accepted: true };
  },
  // Advance to next player's turn or trigger AI
  endTurn() {
    const state = get();
    if (state.winner !== null) {
      return;
    }
    if (state.rules.mode === 'zen') {
      set({ requiredLength: 0, remainingTime: 0 });
      get().roll();
      return;
    }
    const next = state.current === 0 ? 1 : 0;
    set({ current: next, requiredLength: 0, remainingTime: 0 });
    if (state.rules.mode === 'bot' && next === 1) {
      get().roll();
      get().finishRoll();
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
      set({ current: 0, requiredLength: 0, remainingTime: 0 });
      get().roll();
    } else {
      get().roll();
    }
  },
  decrementTimer() {
    const t = get().remainingTime;
    if (t > 0) set({ remainingTime: t - 1 });
  },
  // Toggle sound effects on/off
  toggleMute() {
    set((s) => ({ muted: !s.muted }));
  },
}));
