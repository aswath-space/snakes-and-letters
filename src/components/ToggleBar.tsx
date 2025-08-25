import { useGameStore } from '../store/useGameStore';

export default function ToggleBar() {
  const rules = useGameStore((s) => s.rules);
  const setRules = useGameStore((s) => s.newGame);
  return (
    <div className="flex space-x-2">
      <label>
        <input
          type="checkbox"
          checked={rules.challengeMode}
          onChange={() => setRules({ challengeMode: !rules.challengeMode })}
        />
        Challenge
      </label>
      <label>
        <input
          type="checkbox"
          checked={rules.noRepeats}
          onChange={() => setRules({ noRepeats: !rules.noRepeats })}
        />
        No Repeats
      </label>
      <label>
        <input
          type="checkbox"
          checked={rules.timer}
          onChange={() => setRules({ timer: !rules.timer })}
        />
        Timer
      </label>
      <label>
        <input
          type="checkbox"
          checked={rules.hints}
          onChange={() => setRules({ hints: !rules.hints })}
        />
        Hints
      </label>
    </div>
  );
}
