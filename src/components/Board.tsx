import { useGameStore } from '../store/useGameStore';
import Cell from './Cell';
import { indexToPosition } from '../engine/board';

export default function Board() {
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
    const x1 = from.col + 0.5;
    const y1 = 9 - from.row + 0.5;
    const x2 = to.col + 0.5;
    const y2 = 9 - to.row + 0.5;
    return (
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={item.color}
        strokeWidth={0.2}
        strokeLinecap="round"
      />
    );
  });

  return (
    <div className="relative w-full aspect-square max-w-sm">
      <div className="grid grid-cols-10 w-full h-full">{cells}</div>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 10 10"
      >
        {lines}
      </svg>
    </div>
  );
}
