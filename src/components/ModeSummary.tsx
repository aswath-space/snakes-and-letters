import { useGameStore } from '../store/useGameStore';

export default function ModeSummary() {
  const rules = useGameStore((s) => s.rules);
  return (
    <div className="p-4 bg-white rounded shadow text-sm space-y-1">
      <h2 className="font-bold text-base">Modes</h2>
      <div>{rules.challengeMode ? 'Challenge' : 'Easy'}</div>
      <div>{rules.noRepeats ? 'No Repeats' : 'Repeats Allowed'}</div>
      {rules.timer && <div>Timer Enabled</div>}
      {rules.mode === 'single' && <div>Single Player</div>}
    </div>
  );
}
