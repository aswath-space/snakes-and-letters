import { useState } from 'react';
import { useGameStore } from '../store/useGameStore';

export default function WordInput() {
  const [word, setWord] = useState('');
  const submit = useGameStore((s) => s.submitWord);
  const roll = useGameStore((s) => s.roll);
  return (
    <div className="flex space-x-2">
      <input
        className="border p-1"
        value={word}
        onChange={(e) => setWord(e.target.value)}
      />
      <button className="border px-2" onClick={() => roll()}>
        Roll
      </button>
      <button className="border px-2" onClick={() => submit(word)}>
        Submit
      </button>
    </div>
  );
}
