import { CellIndex, Rules, SnakeOrLadder } from './types';
import { randomInt } from '../utils/random';

export function clampIndex(i: CellIndex, boardSize: number): CellIndex {
  if (i < 0) return 0;
  if (i >= boardSize) return boardSize - 1;
  return i;
}

export function indexToPosition(
  i: CellIndex,
  boardSize: number,
): { row: number; col: number } {
  const width = Math.round(Math.sqrt(boardSize));
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

export function generateSnakesAndLadders(
  boardSize: number,
  snakeCount = 4,
  ladderCount = 6,
): { snakes: SnakeOrLadder[]; ladders: SnakeOrLadder[] } {
  const used = new Set<CellIndex>();
  const snakes: SnakeOrLadder[] = [];
  const ladders: SnakeOrLadder[] = [];
  const max = boardSize - 1;
  while (ladders.length < ladderCount) {
    const from = randomInt(max - 1) + 1; // avoid cell 0 and last cell
    const to = from + randomInt(max - from);
    if (to <= from || used.has(from) || used.has(to)) continue;
    ladders.push({ from, to });
    used.add(from);
    used.add(to);
  }
  while (snakes.length < snakeCount) {
    const from = randomInt(max - 1) + 1;
    const to = randomInt(from);
    if (to >= from || used.has(from) || used.has(to)) continue;
    snakes.push({ from, to });
    used.add(from);
    used.add(to);
  }
  return { snakes, ladders };
}
