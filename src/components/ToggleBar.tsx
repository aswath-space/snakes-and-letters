// Toolbar allowing the user to toggle various game options
import { useGameStore } from '../store/useGameStore';
import type { ChangeEvent } from 'react';

export default function ToggleBar() {
  const rules = useGameStore((s) => s.rules);
  const setRules = useGameStore((s) => s.newGame);
  const muted = useGameStore((s) => s.muted);
  const toggleMute = useGameStore((s) => s.toggleMute);
  const boardWidth = Math.round(Math.sqrt(rules.boardSize));
  const handleSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const size = parseInt(e.target.value, 10);
    setRules({
      boardSize: size * size,
      challengeMode: rules.challengeMode,
      noRepeats: rules.noRepeats,
      timer: rules.timer,
      allowWildcards: rules.allowWildcards,
      mode: rules.mode,
    });
  };
  return (
    <fieldset className="p-4 bg-white rounded shadow flex flex-wrap gap-2">
      <legend className="sr-only">Game options</legend>
      <div className="flex items-center space-x-1">
        <label htmlFor="board-size">Board</label>
        <select
          id="board-size"
          className="border rounded p-1"
          value={boardWidth}
          onChange={handleSizeChange}
        >
          <option value={8}>8×8</option>
          <option value={10}>10×10</option>
          <option value={12}>12×12</option>
        </select>
      </div>
      {/* Toggle challenge mode */}
      <div className="flex items-center space-x-1">
        <input
          id="toggle-challenge"
          type="checkbox"
          checked={rules.challengeMode}
          onChange={() => setRules({ challengeMode: !rules.challengeMode })}
        />
        <label htmlFor="toggle-challenge">Challenge</label>
      </div>
      {/* Toggle no-repeats rule */}
      <div className="flex items-center space-x-1">
        <input
          id="toggle-no-repeats"
          type="checkbox"
          checked={rules.noRepeats}
          onChange={() => setRules({ noRepeats: !rules.noRepeats })}
        />
        <label htmlFor="toggle-no-repeats">No Repeats</label>
      </div>
      {/* Toggle turn timer */}
      <div className="flex items-center space-x-1">
        <input
          id="toggle-timer"
          type="checkbox"
          checked={rules.timer}
          onChange={() => setRules({ timer: !rules.timer })}
        />
        <label htmlFor="toggle-timer">Timer</label>
      </div>
      {/* Toggle sound effects */}
      <div className="flex items-center space-x-1">
        <input
          id="toggle-mute"
          type="checkbox"
          checked={muted}
          onChange={toggleMute}
        />
        <label htmlFor="toggle-mute">Mute</label>
      </div>
    </fieldset>
  );
}
