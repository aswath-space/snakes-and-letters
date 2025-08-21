import { useGameStore } from '../store/useGameStore';

export default function Dice() {
  const { lastDie, roll } = useGameStore();
  return (
    <button className="border px-2" onClick={() => roll()}>
      Die: {lastDie}
    </button>
  );
}
