import { useEffect } from 'react';
import Board from './components/Board';
import WordInput from './components/WordInput';
import HUD from './components/HUD';
import ToggleBar from './components/ToggleBar';
import { loadWordlist } from './dictionary/loader';
import { useGameStore } from './store/useGameStore';

export default function App() {
  const setDictionary = useGameStore((s) => s.setDictionary);
  useEffect(() => {
    loadWordlist().then((d) => setDictionary(d));
  }, [setDictionary]);
  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      <HUD />
      <Board />
      <WordInput />
      <ToggleBar />
    </div>
  );
}
