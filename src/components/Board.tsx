import { useGameStore } from '../store/useGameStore';
import Cell from './Cell';
import { indexToPosition } from '../engine/board';

const CELL_SIZE = 32; // w-8 = 2rem ~32px

export default function Board() {
  const { positions, rules } = useGameStore();
  const { rows, cols } = rules;
  const cells: JSX.Element[] = [];
  for (let row = rows - 1; row >= 0; row--) {
    for (let col = 0; col < cols; col++) {
      const index = row * cols + (row % 2 === 0 ? col : cols - 1 - col);
      cells.push(<Cell key={index} index={index} positions={positions} />);
    }
  }

  const lines = [
    ...rules.snakes.map((s) => ({ ...s, color: 'red' })),
    ...rules.ladders.map((l) => ({ ...l, color: 'green' })),
  ].map((item, i) => {
    const from = indexToPosition(item.from, rules.boardSize, cols);
    const to = indexToPosition(item.to, rules.boardSize, cols);
    const x1 = from.col * CELL_SIZE + CELL_SIZE / 2;
    const y1 = (rows - 1 - from.row) * CELL_SIZE + CELL_SIZE / 2;
    const x2 = to.col * CELL_SIZE + CELL_SIZE / 2;
    const y2 = (rows - 1 - to.row) * CELL_SIZE + CELL_SIZE / 2;
    return (
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={item.color}
        strokeWidth={4}
        strokeLinecap="round"
      />
    );
  });

  const width = cols * CELL_SIZE;
  const height = rows * CELL_SIZE;

  return (
    <div className="relative" style={{ width, height }}>
      <div
        className="grid w-full h-full"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {cells}
      </div>
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {lines}
      </svg>
    </div>
  );
}
