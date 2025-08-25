import { PlayerId } from '../store/useGameStore';
import { motion } from 'framer-motion';

interface CellProps {
  index: number;
  positions: Record<PlayerId, number>;
}

export default function Cell({ index, positions }: CellProps) {
  const tokens: JSX.Element[] = [];
  if (positions[0] === index)
    tokens.push(
      <motion.span
        layoutId="p1"
        key="p1"
        className="absolute top-1 left-1 w-3 h-3 rounded-full bg-red-500"
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />,
    );
  if (positions[1] === index)
    tokens.push(
      <motion.span
        layoutId="p2"
        key="p2"
        className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-blue-500"
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />,
    );
  return (
    <div className="relative w-full aspect-square border flex items-center justify-center text-xs">
      {index + 1}
      {tokens}
    </div>
  );
}
