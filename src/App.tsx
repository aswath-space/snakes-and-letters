import { useCallback, useEffect, useState } from 'react';
import Board from './components/Board';
import WordInput from './components/WordInput';
import HUD from './components/HUD';
import ToggleBar from './components/ToggleBar';
import { useDictionaryStore } from './store/dictionaryStore';

export default function App() {
  const load = useDictionaryStore((s) => s.load);
  const [dictError, setDictError] = useState<string | null>(null);

  const loadDict = useCallback(() => {
    return load()
      .then(() => {
        setDictError(null);
      })
      .catch((e) =>
        setDictError(
          e instanceof Error
            ? e.message
            : 'Failed to load dictionary. Please try again.',
        ),
      );
  }, [load]);

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
