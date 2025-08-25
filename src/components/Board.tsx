import { useGameStore } from '../store/useGameStore';
import Cell from './Cell';
import { indexToPosition } from '../engine/board';
import { LayoutGroup } from 'framer-motion';

// Placeholder asset paths: add `snake.svg` and `ladder.svg` under `public/assets`.

export default function Board() {
  const { positions, rules, boardLetters } = useGameStore();
  const width = Math.round(Math.sqrt(rules.boardSize));
  const cellSize = 100 / width;
  const cells: JSX.Element[] = [];
  for (let row = width - 1; row >= 0; row--) {
    for (let col = 0; col < width; col++) {
      const index = row * width + (row % 2 === 0 ? col : width - 1 - col);
      cells.push(
        <Cell
          key={index}
          index={index}
          positions={positions}
          letter={boardLetters[index]}
          mode={rules.mode}
        />,
      );
    }
  }

  const decorations = [
    ...rules.snakes.map((s) => ({ ...s, type: 'snake' })),
    ...rules.ladders.map((l) => ({ ...l, type: 'ladder' })),
  ].map((item, i) => {
    const from = indexToPosition(item.from, rules.boardSize);
    const to = indexToPosition(item.to, rules.boardSize);
    const dx = (to.col - from.col) * cellSize;
    const dy = (from.row - to.row) * cellSize;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    const x = from.col * cellSize + cellSize / 2;
    const y = (width - 1 - from.row) * cellSize + cellSize / 2;
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
      <div className="relative w-full max-w-[90vmin] aspect-square mx-auto">
        <div
          className="grid w-full h-full"
          style={{ gridTemplateColumns: `repeat(${width}, 1fr)` }}
        >
          {cells}
        </div>
        {decorations}
      </div>
    </LayoutGroup>
  );
}
