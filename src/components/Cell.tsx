import { PlayerId } from '../store/useGameStore';
import { motion } from 'framer-motion';

interface CellProps {
  index: number;
  positions: Record<PlayerId, number>;
  letter?: string;
}

export default function Cell({ index, positions, letter }: CellProps) {
  const tokens: JSX.Element[] = [];
  if (positions[0] === index)
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
  if (positions[1] === index)
    tokens.push(
      <motion.img
        layoutId="p2"
        key="p2"
        src="/assets/bluepawn.svg"
        alt="P2"
        className="absolute top-1 right-1 w-4 h-4"
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />,
    );
  return (
    <div className="relative w-full aspect-square border flex items-center justify-center">
      <span className="absolute top-1 left-1 text-[0.5rem]">{index + 1}</span>
      <span className="text-[clamp(0.5rem,2vmin,1.25rem)]">{letter}</span>
      {tokens}
    </div>
  );
}
