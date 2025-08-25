import { useGameStore } from '../store/useGameStore';

export default function ModeSummary() {
  const rules = useGameStore((s) => s.rules);
  const size = Math.round(Math.sqrt(rules.boardSize));
  return (
    <div className="p-4 bg-white rounded shadow flex flex-col space-y-2 text-primary">
      <div>
        Board: {size}×{size}
      </div>
      <div>Challenge: {rules.challengeMode ? 'On' : 'Off'}</div>
      <div>No Repeats: {rules.noRepeats ? 'On' : 'Off'}</div>
      <div>Timer: {rules.timer ? 'On' : 'Off'}</div>
    </div>
  );
}
