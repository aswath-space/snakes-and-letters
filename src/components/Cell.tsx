// Individual board cell that can display player tokens and letters
import { PlayerId } from '../store/useGameStore';
import { motion } from 'framer-motion';
import type { Rules } from '../engine';

interface CellProps {
  index: number;
  positions: Record<PlayerId, number>;
  letter?: string;
  mode: Rules['mode'];
}

export default function Cell({ index, positions, letter, mode }: CellProps) {
  const tokens: JSX.Element[] = [];

  // Render player one token if on this cell
  if (positions[0] === index) {
    tokens.push(
      <motion.img
        layoutId="p1"
        key="p1"
        src="/assets/redpawn.svg"
        alt="P1"
        className="absolute top-1 right-1 w-4 h-4"
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
        className="absolute bottom-1 right-1 w-4 h-4"
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />,
    );
  }

  return (
    <div className="relative w-full aspect-square border flex items-center justify-center">
      <span className="absolute top-1 left-1 text-[0.5rem]">{index + 1}</span>
      <span className="text-[clamp(0.5rem,2vmin,1.25rem)]">{letter}</span>
      {tokens}
    </div>
  );
}
