import React from 'react';
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
    </div>
  );
}
