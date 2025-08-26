// Individual board cell that can display player tokens and letters
import { PlayerId } from '../store/useGameStore';
import { motion } from 'framer-motion';
import type { Rules } from '../engine';

interface CellProps {
  index: number;
  positions: Record<PlayerId, number>;
  letter?: string;
  mode: Rules['mode'];
  boardWidth: number;
}

export default function Cell({ index, positions, letter, mode, boardWidth }: CellProps) {
  const tokens: JSX.Element[] = [];
  const unit = 90 / boardWidth; // vmin per cell

  // Render player one token if on this cell
  if (positions[0] === index) {
    tokens.push(
      <motion.img
        layoutId="p1"
        key="p1"
        src="/assets/redpawn.svg"
        alt="P1"
        className="absolute"
        style={{
          width: `${unit * 0.4}vmin`,
          height: `${unit * 0.4}vmin`,
          top: `${unit * 0.1}vmin`,
          right: `${unit * 0.1}vmin`,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />,
    );
  }

  // Only show second player when not in single-player mode
  if (mode !== 'zen' && positions[1] === index) {
    tokens.push(
      <motion.img
        layoutId="p2"
        key="p2"
        src="/assets/bluepawn.svg"
        alt="P2"
        className="absolute"
        style={{
          width: `${unit * 0.4}vmin`,
          height: `${unit * 0.4}vmin`,
          bottom: `${unit * 0.1}vmin`,
          right: `${unit * 0.1}vmin`,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />,
    );
  }

  return (
    <div className="relative w-full aspect-square border flex items-center justify-center">
      <span
        className="absolute"
        style={{
          top: `${unit * 0.1}vmin`,
          left: `${unit * 0.1}vmin`,
          fontSize: `${unit * 0.25}vmin`,
        }}
      >
        {index + 1}
      </span>
      <span style={{ fontSize: `${unit * 0.5}vmin` }}>{letter}</span>
      {tokens}
    </div>
  );
}
