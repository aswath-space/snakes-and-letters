import { useGameStore } from '../store/useGameStore';

export default function ToggleBar() {
  const rules = useGameStore((s) => s.rules);
  const setRules = useGameStore((s) => s.newGame);
  return (
    <div className="flex space-x-2">
      <label>
        Size
        <select
          className="ml-1"
          value={rules.rows}
          onChange={(e) =>
            setRules({
              rows: Number(e.target.value),
              cols: Number(e.target.value),
            })
          }
        >
          {[8, 10, 12].map((n) => (
            <option key={n} value={n}>
              {n}×{n}
            </option>
          ))}
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={rules.randomSnakes}
          onChange={() => setRules({ randomSnakes: !rules.randomSnakes })}
        />
        Random Board
      </label>
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
    </div>
  );
}
