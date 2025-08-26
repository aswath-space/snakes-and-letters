// Renders the game board grid and decorative snakes and ladders
import { useGameStore } from '../store/useGameStore';
import Cell from './Cell';
import { indexToPosition } from '../engine/board';
import { LayoutGroup } from 'framer-motion';
import type { Ref } from 'react';

interface BoardProps {
  boardRef?: Ref<HTMLDivElement>;
}

export default function Board({ boardRef }: BoardProps) {
  const { positions, rules, boardLetters, current } = useGameStore();
  const width = Math.round(Math.sqrt(rules.boardSize));
  const cellSize = 100 / width;
  const cells: JSX.Element[] = [];
  // Build serpentine board layout
  for (let row = width - 1; row >= 0; row--) {
    for (let col = 0; col < width; col++) {
      const index = row * width + (row % 2 === 0 ? col : width - 1 - col);
      cells.push(
        <Cell
          key={index}
          index={index}
          positions={positions}
          current={current}
          letter={boardLetters[index]}
          mode={rules.mode}
          boardWidth={width}
        />,
      );
    }
  }

  // Decorative snakes and ladders
  const decorations = [
    ...rules.snakes.map((s) => ({ ...s, type: 'snake' as const })),
    ...rules.ladders.map((l) => ({ ...l, type: 'ladder' as const })),
  ].flatMap((item, i) => {
    const from = indexToPosition(item.from, rules.boardSize);
    const to = indexToPosition(item.to, rules.boardSize);
    const dx = (to.col - from.col) * cellSize;
    const dy = (from.row - to.row) * cellSize;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    const x = from.col * cellSize + cellSize / 2;
    const y = (width - 1 - from.row) * cellSize + cellSize / 2;

    if (item.type === 'snake') {
      const elements = [
        <div
          key={`snake-${i}`}
          className="absolute pointer-events-none bg-green-600"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: `${length}%`,
            height: `${cellSize * 0.2}%`,
            transform: `translateY(-50%) rotate(${angle}deg)`,
            transformOrigin: '0% 50%',
          }}
        />,
      ];
      // Add a simple eye at the snake's head
      const eyeSize = cellSize * 0.2;
      elements.push(
        <div
          key={`snake-eye-${i}`}
          className="absolute pointer-events-none bg-black rounded-full"
          style={{
            width: `${eyeSize}%`,
            height: `${eyeSize}%`,
            left: `calc(${x}% - ${eyeSize / 2}%)`,
            top: `calc(${y}% - ${eyeSize / 2}%)`,
          }}
        />,
      );
      return elements;
    }

    // Ladder with vertical rails and horizontal rungs
    const thickness = cellSize * 0.3;
    const stepCount = Math.max(2, Math.floor(length / cellSize));
    return (
      <div
        key={`ladder-${i}`}
        className="absolute pointer-events-none"
        style={{
          left: `${x}%`,
          top: `${y}%`,
          width: `${thickness}%`,
          height: `${length}%`,
          transform: `translateX(-50%) rotate(${angle}deg)`,
          transformOrigin: '50% 0%',
        }}
      >
        <span
          className="absolute bg-yellow-500"
          style={{ top: 0, bottom: 0, left: 0, width: '30%' }}
        />
        <span
          className="absolute bg-yellow-500"
          style={{ top: 0, bottom: 0, right: 0, width: '30%' }}
        />
        {Array.from({ length: stepCount }).map((_, j) => (
          <span
            key={j}
            className="absolute bg-yellow-500"
            style={{
              left: 0,
              right: 0,
              height: '20%',
              top: `${((j + 1) / (stepCount + 1)) * 100}%`,
            }}
          />
        ))}
      </div>
    );
  });

  return (
    <LayoutGroup>
      <div
        ref={boardRef}
        className="relative overflow-hidden w-full max-w-[90vmin] aspect-square mx-auto"
      >
        <div className="absolute inset-0 pointer-events-none z-0">
          {decorations}
        </div>
        <div
          className="relative z-10 grid w-full h-full"
          style={{ gridTemplateColumns: `repeat(${width}, 1fr)` }}
        >
          {cells}
        </div>
      </div>
    </LayoutGroup>
  );
}
