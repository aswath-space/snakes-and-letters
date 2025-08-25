import { useGameStore } from '../store/useGameStore';
import Cell from './Cell';
import { indexToPosition } from '../engine/board';

const CELL_SIZE = 32; // w-8 = 2rem ~32px

export default function Board(): JSX.Element {
  const { positions, rules } = useGameStore();
  const cells: JSX.Element[] = [];
  for (let row = 9; row >= 0; row--) {
    for (let col = 0; col < 10; col++) {
      const index = row * 10 + (row % 2 === 0 ? col : 9 - col);
      cells.push(<Cell key={index} index={index} positions={positions} />);
    }
  }

  const lines = [
    ...rules.snakes.map((s) => ({ ...s, color: 'red' })),
    ...rules.ladders.map((l) => ({ ...l, color: 'green' })),
  ].map((item, i) => {
    const from = indexToPosition(item.from, rules.boardSize);
    const to = indexToPosition(item.to, rules.boardSize);
    const x1 = from.col * CELL_SIZE + CELL_SIZE / 2;
    const y1 = (9 - from.row) * CELL_SIZE + CELL_SIZE / 2;
    const x2 = to.col * CELL_SIZE + CELL_SIZE / 2;
    const y2 = (9 - to.row) * CELL_SIZE + CELL_SIZE / 2;
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

  return (
    <div className="relative w-80 h-80">
      <div className="grid grid-cols-10 w-full h-full">{cells}</div>
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {lines}
      </svg>
    </div>
  );
}
