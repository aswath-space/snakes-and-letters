import { useState } from 'react';
import { loadWordlist } from '../dictionary/loader';
import { useGameStore } from '../store/useGameStore';

export default function ToggleBar() {
  const rules = useGameStore((s) => s.rules);
  const newGame = useGameStore((s) => s.newGame);
  const setDictionary = useGameStore((s) => s.setDictionary);
  const [dictId, setDictId] = useState('english');

  const changeDict = (id: string) => {
    void loadWordlist(id).then((d) => {
      setDictionary(d);
      newGame();
    });
  };

  const handleDictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setDictId(id);
    changeDict(id);
  };
  return (
    <div className="flex space-x-2">
      <select
        className="border p-1 rounded"
        value={dictId}
        onChange={handleDictChange}
      >
        <option value="english">English</option>
        <option value="animals">Animals</option>
      </select>
      <label>
        <input
          type="checkbox"
          checked={rules.challengeMode}
          onChange={() => newGame({ challengeMode: !rules.challengeMode })}
        />
        Challenge
      </label>
      <label>
        <input
          type="checkbox"
          checked={rules.noRepeats}
          onChange={() => newGame({ noRepeats: !rules.noRepeats })}
        />
        No Repeats
      </label>
      <label>
        <input
          type="checkbox"
          checked={rules.timer}
          onChange={() => newGame({ timer: !rules.timer })}
        />
        Timer
      </label>
    </div>
  );
}
