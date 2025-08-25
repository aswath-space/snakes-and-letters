export type CellIndex = number;

export interface SnakeOrLadder {
  from: CellIndex;
  to: CellIndex;
}

export interface Rules {
  rows: number;
  cols: number;
  boardSize: number;
  snakes: SnakeOrLadder[];
  ladders: SnakeOrLadder[];
  allowWildcards: boolean;
  challengeMode: boolean;
  noRepeats: boolean;
  timer: boolean;
  randomSnakes: boolean;
}
