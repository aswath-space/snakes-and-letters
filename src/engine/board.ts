import { CellIndex, Rules } from './types';

export function clampIndex(i: CellIndex, boardSize: number): CellIndex {
  if (i < 0) return 0;
  if (i >= boardSize) return boardSize - 1;
  return i;
}

export function indexToPosition(
  i: CellIndex,
  boardSize: number,
  width = 10
): { row: number; col: number } {
  const clamped = clampIndex(i, boardSize);
  const row = Math.floor(clamped / width);
  const colInRow = clamped % width;
  const col = row % 2 === 0 ? colInRow : width - 1 - colInRow;
  return { row, col };
}

export function resolveSnakesAndLadders(
  index: CellIndex,
  rules: Rules
): CellIndex {
  let current = index;
  const visited = new Set<CellIndex>();
  let last = current;
  while (!visited.has(current)) {
    visited.add(current);
    const snake = rules.snakes.find((s) => s.from === current);
    if (snake) {
      last = current;
      current = snake.to;
      continue;
    }
    const ladder = rules.ladders.find((l) => l.from === current);
    if (ladder) {
      last = current;
      current = ladder.to;
      continue;
    }
    return current;
  }
  return Math.min(current, last);
}
