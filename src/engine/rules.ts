import { Rules, SnakeOrLadder } from './types';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateSnakesAndLadders(
  rows: number,
  cols: number,
  snakeCount = 4,
  ladderCount = 4,
): { snakes: SnakeOrLadder[]; ladders: SnakeOrLadder[] } {
  const size = rows * cols;
  const snakes: SnakeOrLadder[] = [];
  const ladders: SnakeOrLadder[] = [];
  const used = new Set<number>();

  const pickPair = (isSnake: boolean): SnakeOrLadder => {
    let from = 0;
    let to = 0;
    do {
      from = randomInt(1, size - 1);
      to = randomInt(1, size - 1);
    } while (
      from === to ||
      used.has(from) ||
      (isSnake ? from <= to : from >= to)
    );
    used.add(from);
    return { from, to };
  };

  for (let i = 0; i < snakeCount; i++) {
    snakes.push(pickPair(true));
  }
  for (let i = 0; i < ladderCount; i++) {
    ladders.push(pickPair(false));
  }

  return { snakes, ladders };
}

export const defaultRules: Rules = {
  rows: 10,
  cols: 10,
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
  randomSnakes: false,
};
