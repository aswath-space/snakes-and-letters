import { useState } from 'react';

type SetupOptions = {
  boardSize: number;
  challengeMode: boolean;
  mode: 'single' | 'multi';
};

interface Props {
  onStart(options: SetupOptions): void;
}

export default function GameSetupModal({ onStart }: Props) {
  const [boardSize, setBoardSize] = useState(100);
  const [challengeMode, setChallengeMode] = useState(false);
  const [mode, setMode] = useState<'single' | 'multi'>('multi');

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-4 rounded shadow w-80 space-y-4">
        <h2 className="text-lg font-bold">Game Setup</h2>
        <label className="block text-sm">
          Board Size
          <input
            type="number"
            value={boardSize}
            min={10}
            step={10}
            onChange={(e) => setBoardSize(Number(e.target.value))}
            className="mt-1 w-full border p-1"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={challengeMode}
            onChange={(e) => setChallengeMode(e.target.checked)}
          />
          Challenge Mode
        </label>
        <div className="text-sm space-y-1">
          <div>Mode</div>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={mode === 'multi'}
              onChange={() => setMode('multi')}
            />
            Multiplayer
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={mode === 'single'}
              onChange={() => setMode('single')}
            />
            Single Player
          </label>
        </div>
        <button
          type="button"
          className="w-full bg-blue-500 text-white py-1 rounded"
          onClick={() => onStart({ boardSize, challengeMode, mode })}
        >
          Start Game
        </button>
      </div>
    </div>
  );
}
