import { PlayerId } from '../store/useGameStore';

export interface CellProps {
  index: number;
  positions: Record<PlayerId, number>;
}

export default function Cell({ index, positions }: CellProps): JSX.Element {
  const tokens: JSX.Element[] = [];
  if (positions[0] === index)
    tokens.push(
      <span
        key="p1"
        className="absolute top-1 left-1 w-3 h-3 rounded-full bg-red-500"
      />,
    );
  if (positions[1] === index)
    tokens.push(
      <span
        key="p2"
        className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-blue-500"
      />,
    );
  return (
    <div className="relative w-8 h-8 border flex items-center justify-center text-xs">
      {index + 1}
      {tokens}
    </div>
  );
}
