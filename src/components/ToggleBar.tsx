import { useGameStore } from '../store/useGameStore';

export default function ToggleBar() {
  const rules = useGameStore((s) => s.rules);
  const setRules = useGameStore((s) => s.newGame);
  return (
    <fieldset className="flex space-x-2">
      <legend className="sr-only">Game options</legend>
      <div className="flex items-center space-x-1">
        <input
          id="toggle-challenge"
          type="checkbox"
          checked={rules.challengeMode}
          onChange={() => setRules({ challengeMode: !rules.challengeMode })}
        />
        <label htmlFor="toggle-challenge">Challenge</label>
      </div>
      <div className="flex items-center space-x-1">
        <input
          id="toggle-no-repeats"
          type="checkbox"
          checked={rules.noRepeats}
          onChange={() => setRules({ noRepeats: !rules.noRepeats })}
        />
        <label htmlFor="toggle-no-repeats">No Repeats</label>
      </div>
      <div className="flex items-center space-x-1">
        <input
          id="toggle-timer"
          type="checkbox"
          checked={rules.timer}
          onChange={() => setRules({ timer: !rules.timer })}
        />
        <label htmlFor="toggle-timer">Timer</label>
      </div>
    </fieldset>
  );
}
