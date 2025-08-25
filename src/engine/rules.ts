import { Rules } from './types';

export const defaultRules: Rules = {
  boardSize: 100,
  snakes: [
    { from: 16, to: 6 },
    { from: 48, to: 30 },
    { from: 62, to: 19 },
    { from: 88, to: 24 },
  ],
  ladders: [
    { from: 2, to: 38 },
    { from: 7, to: 14 },
    { from: 8, to: 31 },
    { from: 15, to: 26 },
    { from: 21, to: 42 },
    { from: 28, to: 84 },
  ],
  allowWildcards: true,
  challengeMode: false,
  noRepeats: false,
  timer: false,
  mode: 'multi',
};
