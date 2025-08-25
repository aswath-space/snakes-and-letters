import { useGameStore } from '../store/useGameStore';
import Cell from './Cell';
import { indexToPosition } from '../engine/board';
import { LayoutGroup } from 'framer-motion';

// Placeholder asset paths: add `snake.svg` and `ladder.svg` under `public/assets`.

export default function Board() {
  const { positions, rules } = useGameStore();
  const cells: JSX.Element[] = [];
  for (let row = 9; row >= 0; row--) {
    for (let col = 0; col < 10; col++) {
      const index = row * 10 + (row % 2 === 0 ? col : 9 - col);
      cells.push(<Cell key={index} index={index} positions={positions} />);
    }
  }

  const decorations = [
    ...rules.snakes.map((s) => ({ ...s, type: 'snake' })),
    ...rules.ladders.map((l) => ({ ...l, type: 'ladder' })),
  ].map((item, i) => {
    const from = indexToPosition(item.from, rules.boardSize);
    const to = indexToPosition(item.to, rules.boardSize);
    const dx = (to.col - from.col) * 10;
    const dy = (from.row - to.row) * 10;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    const x = from.col * 10 + 5;
    const y = (9 - from.row) * 10 + 5;
    // Image files are not included; provide them at /public/assets.
    const src = `/assets/${item.type}.svg`;
    return (
      <img
        key={i}
        src={src}
        alt={item.type}
        className="absolute pointer-events-none"
        style={{
          left: `${x}%`,
          top: `${y}%`,
          width: `${length}%`,
          height: '5%',
          transform: `translateY(-50%) rotate(${angle}deg)`,
          transformOrigin: '0% 50%',
        }}
      />
    );
  });

  return (
    <LayoutGroup>
      <div className="relative w-full max-w-sm aspect-square mx-auto">
        <div className="grid grid-cols-10 w-full h-full">{cells}</div>
        {decorations}
      </div>
    </LayoutGroup>
  );
}
