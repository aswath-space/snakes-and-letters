import { useCallback, useEffect, useState } from 'react';
// Core game components
import Board from './components/Board';
import WordInput from './components/WordInput';
import HUD from './components/HUD';
import ModeSummary from './components/ModeSummary';
// Helper utilities and state store
import { loadWordlist } from './dictionary/loader';
import { useGameStore } from './store/useGameStore';
import GameSetupModal from './components/GameSetupModal';

export default function App() {
  const setDictionary = useGameStore((s) => s.setDictionary);
  const newGame = useGameStore((s) => s.newGame);
  const winner = useGameStore((s) => s.winner);
  const [dictError, setDictError] = useState<string | null>(null);
  const [dictLoading, setDictLoading] = useState(true);
  const [showSetup, setShowSetup] = useState(true);

  // Loads dictionary data and stores it in state
  const loadDict = useCallback(() => {
    setDictLoading(true);
    setDictError(null);
    return loadWordlist()
      .then((d) => {
        setDictionary(d);
      })
      .catch((e) =>
        setDictError(
          e instanceof Error
            ? e.message
            : 'Failed to load dictionary. Please try again.',
        ),
      )
      .finally(() => setDictLoading(false));
  }, [setDictionary]);

  // Fetch dictionary on initial mount
  useEffect(() => {
    void loadDict();
  }, [loadDict]);

  return (
    <div className="p-4 space-y-4 mx-auto">
      {dictLoading && (
        <div role="status" className="text-center">
          Loading dictionary...
        </div>
      )}
      {dictError && (
        <div
          role="alert"
          className="p-2 text-red-600 text-sm border border-red-400 rounded"
        >
          {dictError}{' '}
          <button className="underline" onClick={loadDict} type="button">
            Retry
          </button>
        </div>
      )}
      {winner !== null && (
        <div
          role="status"
          className="p-2 bg-green-100 border border-green-400 text-green-700 text-center rounded"
        >
          Player {winner + 1} wins!
        </div>
      )}
      {!dictLoading && !dictError && (
        <>
          {showSetup ? (
            // Initial setup modal before starting the game
            <GameSetupModal
              onStart={(opts) => {
                newGame(opts);
                setShowSetup(false);
              }}
            />
          ) : (
            <>
              <div className="flex gap-4 items-start justify-center">
                <ModeSummary />
                <Board />
                <HUD />
              </div>
              <WordInput />
            </>
          )}
        </>
      )}
    </div>
  );
}
