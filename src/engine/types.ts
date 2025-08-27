// Board cell index represented as a number
export type CellIndex = number;

// Mapping from one cell to another for snakes or ladders
export interface SnakeOrLadder {
  from: CellIndex;
  to: CellIndex;
}

// Game rules configuring board and gameplay options
export interface Rules {
  boardSize: number;
  snakes: SnakeOrLadder[];
  ladders: SnakeOrLadder[];
  allowWildcards: boolean;
  challengeMode: boolean;
  noRepeats: boolean;
  timer: boolean;
  mode: 'bot' | 'multi' | 'zen';
  bot: { name: string; skill: 'easy' | 'normal' | 'hard' } | null;
}
