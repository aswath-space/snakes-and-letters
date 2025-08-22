import { useGameStore } from '../store/useGameStore';

const faces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

interface DiceProps {
  value?: number;
}

export default function Dice({ value }: DiceProps) {
  if (typeof value === 'number') {
    return (
      <div className="w-12 h-12 border rounded flex items-center justify-center text-2xl">
        {faces[value - 1]}
      </div>
    );
  }

  const { lastDie, roll } = useGameStore();
  return (
    <button
      className="w-12 h-12 border rounded flex items-center justify-center text-2xl"
      onClick={roll}
      aria-label="Roll die"
    >
      {lastDie ? faces[lastDie - 1] : '🎲'}
    </button>
  );
}
