import { useState } from 'react';

// Options chosen in the setup screen
type BotProfile = { name: string; skill: 'easy' | 'normal' | 'hard' };
type SetupOptions = {
  boardSize: number;
  challengeMode: boolean;
  noRepeats: boolean;
  timer: boolean;
  mode: 'bot' | 'multi' | 'zen';
  bot: BotProfile | null;
};

interface Props {
  onStart(options: SetupOptions): void;
}

export default function GameSetupModal({ onStart }: Props) {
  const [boardWidth, setBoardWidth] = useState(10);
  const [challengeMode, setChallengeMode] = useState(false);
  const [noRepeats, setNoRepeats] = useState(false);
  const [timer, setTimer] = useState(false);
  const [mode, setMode] = useState<'bot' | 'multi' | 'zen'>('multi');
  const bots: BotProfile[] = [
    { name: 'Ava', skill: 'easy' },
    { name: 'Blake', skill: 'normal' },
    { name: 'Cora', skill: 'hard' },
  ];
  const [botIndex, setBotIndex] = useState(0);

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
              checked={mode === 'zen'}
              onChange={() => setMode('zen')}
            />
            Zen Mode
          </label>
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
        {mode === 'bot' && (
          <label className="block text-sm">
            Opponent
            <select
              value={botIndex}
              onChange={(e) => setBotIndex(Number(e.target.value))}
              className="mt-1 w-full border p-1"
            >
              {bots.map((b, i) => (
                <option
                  key={b.name}
                  value={i}
                >{`${b.name} (${b.skill})`}</option>
              ))}
            </select>
          </label>
        )}
        {/* Start button initializes game with selected options */}
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
              bot: mode === 'bot' ? bots[botIndex] : null,
            })
          }
        >
          Start Game
        </button>
      </div>
    </div>
  );
}
