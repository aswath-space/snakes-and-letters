import { useCallback, useEffect, useState } from 'react';
import Board from './components/Board';
import WordInput from './components/WordInput';
import HUD from './components/HUD';
import ToggleBar from './components/ToggleBar';
import { loadWordlist } from './dictionary/loader';
import { useGameStore } from './store/useGameStore';

export default function App(): JSX.Element {
  const setDictionary = useGameStore((s) => s.setDictionary);
  const [dictError, setDictError] = useState<string | null>(null);

  const loadDict = useCallback(() => {
    return loadWordlist()
      .then((d) => {
        setDictionary(d);
        setDictError(null);
      })
      .catch((e) =>
        setDictError(
          e instanceof Error
            ? e.message
            : 'Failed to load dictionary. Please try again.',
        ),
      );
  }, [setDictionary]);

  useEffect(() => {
    void loadDict();
  }, [loadDict]);
  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
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
      <HUD />
      <Board />
      <WordInput />
      <ToggleBar />
    </div>
  );
}
