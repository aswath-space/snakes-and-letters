import { useGameStore } from '../store/useGameStore';

export default function ToggleBar() {
  const rules = useGameStore((s) => s.rules);
  const setRules = useGameStore((s) => s.newGame);
  return (
    <div className="flex space-x-2 text-primary font-sans">
      <label className="flex items-center space-x-1">
        <input
          type="checkbox"
          className="accent-secondary"
          checked={rules.challengeMode}
          onChange={() => setRules({ challengeMode: !rules.challengeMode })}
        />
        <span>Challenge</span>
      </label>
      <label className="flex items-center space-x-1">
        <input
          type="checkbox"
          className="accent-secondary"
          checked={rules.noRepeats}
          onChange={() => setRules({ noRepeats: !rules.noRepeats })}
        />
        <span>No Repeats</span>
      </label>
      <label className="flex items-center space-x-1">
        <input
          type="checkbox"
          className="accent-secondary"
          checked={rules.timer}
          onChange={() => setRules({ timer: !rules.timer })}
        />
        <span>Timer</span>
      </label>
    </div>
  );
}
