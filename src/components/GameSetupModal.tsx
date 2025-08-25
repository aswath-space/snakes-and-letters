import { useState } from 'react';

type SetupOptions = {
  boardSize: number;
  challengeMode: boolean;
  noRepeats: boolean;
  timer: boolean;
  mode: 'bot' | 'multi';
};

interface Props {
  onStart(options: SetupOptions): void;
}

export default function GameSetupModal({ onStart }: Props) {
  const [boardWidth, setBoardWidth] = useState(10);
  const [challengeMode, setChallengeMode] = useState(false);
  const [noRepeats, setNoRepeats] = useState(false);
  const [timer, setTimer] = useState(false);
  const [mode, setMode] = useState<'bot' | 'multi'>('multi');

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-4 m-4 rounded shadow w-64 space-y-4">
        <h2 className="text-lg font-bold">Game Setup</h2>
        <label className="block text-sm">
          Board Size
          <select
            value={boardWidth}
            onChange={(e) => setBoardWidth(Number(e.target.value))}
            className="mt-1 w-full border p-1"
          >
            <option value={8}>8×8</option>
            <option value={10}>10×10</option>
            <option value={12}>12×12</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={challengeMode}
            onChange={(e) => setChallengeMode(e.target.checked)}
          />
          Challenge Mode
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={noRepeats}
            onChange={(e) => setNoRepeats(e.target.checked)}
          />
          No Repeats
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={timer}
            onChange={(e) => setTimer(e.target.checked)}
          />
          Timer
        </label>
        <div className="text-sm space-y-1">
          <div>Players</div>
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
              checked={mode === 'bot'}
              onChange={() => setMode('bot')}
            />
            Play vs Bot
          </label>
        </div>
        <button
          type="button"
          className="w-full bg-blue-500 text-white py-1 rounded"
          onClick={() =>
            onStart({
              boardSize: boardWidth * boardWidth,
              challengeMode,
              noRepeats,
              timer,
              mode,
            })
          }
        >
          Start Game
        </button>
      </div>
    </div>
  );
}
