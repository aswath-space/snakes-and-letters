// Renders the game board grid and decorative snakes and ladders
import { useGameStore } from '../store/useGameStore';
import Cell from './Cell';
import { indexToPosition } from '../engine/board';
import { LayoutGroup, motion } from 'framer-motion';
import { useMemo, type Ref } from 'react';

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

  const decorations = useMemo(() => {
    const elems: JSX.Element[] = [];
    const randHue = () => Math.floor(Math.random() * 360);

    rules.snakes.forEach((s, i) => {
      const from = indexToPosition(s.from, rules.boardSize);
      const to = indexToPosition(s.to, rules.boardSize);
      const dx = (to.col - from.col) * cellSize;
      const dy = (from.row - to.row) * cellSize;
      const x = from.col * cellSize + cellSize / 2;
      const y = (width - 1 - from.row) * cellSize + cellSize / 2;

      const startX = x;
      const startY = y;
      const endX = x + dx;
      const endY = y + dy;
      const strokeWidth = cellSize * 0.15;
      const hue = randHue();
      const light = `hsl(${hue} 70% 70%)`;
      const dark = `hsl(${hue} 70% 40%)`;

      elems.push(
        <svg
          key={`snake-${i}`}
          className="absolute inset-0 pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id={`snake-gradient-${i}`}
              gradientUnits="userSpaceOnUse"
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
            >
              <stop offset="0%" stopColor={light} stopOpacity="0.6" />
              <stop offset="100%" stopColor={dark} stopOpacity="0.6" />
            </linearGradient>
            <marker
              id={`snake-head-${i}`}
              markerWidth="4"
              markerHeight="4"
              refX="2"
              refY="2"
              orient="auto"
            >
              <polygon points="0,0 4,2 0,4" fill={dark} fillOpacity="0.8" />
            </marker>
            <marker
              id={`snake-tail-${i}`}
              markerWidth="4"
              markerHeight="4"
              refX="2"
              refY="2"
              orient="auto"
            >
              <circle cx="2" cy="2" r="1.5" fill={light} fillOpacity="0.8" />
            </marker>
          </defs>
          <line
            x1={startX}
            y1={startY}
            x2={endX}
            y2={endY}
            stroke={`url(#snake-gradient-${i})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            markerStart={`url(#snake-tail-${i})`}
            markerEnd={`url(#snake-head-${i})`}
          />
        </svg>,
      );
    });

    rules.ladders.forEach((l, i) => {
      const from = indexToPosition(l.from, rules.boardSize);
      const to = indexToPosition(l.to, rules.boardSize);
      const dx = (to.col - from.col) * cellSize;
      const dy = (from.row - to.row) * cellSize;
      const length = Math.sqrt(dx * dx + dy * dy);
      const x = from.col * cellSize + cellSize / 2;
      const y = (width - 1 - from.row) * cellSize + cellSize / 2;

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

      const hue = randHue();
      const color = `hsl(${hue} 70% 50%)`;

      elems.push(
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
            stroke={color}
            strokeWidth={railWidth}
            strokeLinecap="round"
          />
          <line
            x1={r2sx}
            y1={r2sy}
            x2={r2ex}
            y2={r2ey}
            stroke={color}
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
                stroke={color}
                strokeWidth={railWidth}
                strokeLinecap="round"
              />
            );
          })}
        </svg>,
      );
    });

    return elems;
  }, [rules.snakes, rules.ladders, cellSize, width, rules.boardSize]);

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
        {positions[0] === -1 && (
          <motion.img
            layoutId="p1"
            src="/assets/redpawn.svg"
            alt="P1"
            className="absolute z-20"
            style={{
              width: `${cellSize * 0.4}%`,
              height: `${cellSize * 0.4}%`,
              bottom: `${cellSize * 0.1}%`,
              left: `${cellSize * 0.1}%`,
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}
        {rules.mode !== 'zen' && positions[1] === -1 && (
          <motion.img
            layoutId="p2"
            src="/assets/bluepawn.svg"
            alt="P2"
            className="absolute z-20"
            style={{
              width: `${cellSize * 0.4}%`,
              height: `${cellSize * 0.4}%`,
              bottom: `${cellSize * 0.55}%`,
              left: `${cellSize * 0.1}%`,
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}
      </div>
    </LayoutGroup>
  );
}
