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

    // Ladder with separate rails and rungs drawn as SVG lines
    const railSpacing = cellSize * 0.5;
    const railWidth = cellSize * 0.1;
    const stepCount = Math.max(2, Math.floor(length / cellSize));
    const angleRad = Math.atan2(dy, dx);
    const ux = Math.cos(angleRad);
    const uy = Math.sin(angleRad);
    const px = -uy;
    const py = ux;

    const startX = x;
    const startY = y;
    const endX = x + ux * length;
    const endY = y + uy * length;

    const r1sx = startX + px * (railSpacing / 2);
    const r1sy = startY + py * (railSpacing / 2);
    const r1ex = endX + px * (railSpacing / 2);
    const r1ey = endY + py * (railSpacing / 2);

    const r2sx = startX - px * (railSpacing / 2);
    const r2sy = startY - py * (railSpacing / 2);
    const r2ex = endX - px * (railSpacing / 2);
    const r2ey = endY - py * (railSpacing / 2);

    return (
      <svg
        key={`ladder-${i}`}
        className="absolute inset-0 pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <line
          x1={r1sx}
          y1={r1sy}
          x2={r1ex}
          y2={r1ey}
          stroke="#eab308"
          strokeWidth={railWidth}
          strokeLinecap="round"
        />
        <line
          x1={r2sx}
          y1={r2sy}
          x2={r2ex}
          y2={r2ey}
          stroke="#eab308"
          strokeWidth={railWidth}
          strokeLinecap="round"
        />
        {Array.from({ length: stepCount }).map((_, j) => {
          const t = (j + 1) / (stepCount + 1);
          const cx = startX + ux * length * t;
          const cy = startY + uy * length * t;
          const rsx = cx + px * (railSpacing / 2);
          const rsy = cy + py * (railSpacing / 2);
          const rex = cx - px * (railSpacing / 2);
          const rey = cy - py * (railSpacing / 2);
          return (
            <line
              key={j}
              x1={rsx}
              y1={rsy}
              x2={rex}
              y2={rey}
              stroke="#eab308"
              strokeWidth={railWidth}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
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
