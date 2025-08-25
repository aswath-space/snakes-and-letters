import { useCallback, useEffect, useState } from 'react';
import Board from './components/Board';
import WordInput from './components/WordInput';
import HUD from './components/HUD';
import { loadWordlist } from './dictionary/loader';
import { useGameStore } from './store/useGameStore';
import GameSetupModal from './components/GameSetupModal';
import ModeSummary from './components/ModeSummary';

export default function App() {
  const setDictionary = useGameStore((s) => s.setDictionary);
  const newGame = useGameStore((s) => s.newGame);
  const [dictError, setDictError] = useState<string | null>(null);
  const [dictLoading, setDictLoading] = useState(true);
  const [showSetup, setShowSetup] = useState(true);

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
      {!dictLoading && !dictError && (
        <>
          {showSetup ? (
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
