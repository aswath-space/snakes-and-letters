import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { validateWord } from '../engine/validate';
import { hasWord } from '../dictionary/loader';

// Sound files live under /public/assets/sounds; actual files are not committed.

export default function WordInput() {
  const [word, setWord] = useState('');
  const [useWildcard, setUseWildcard] = useState(false);
  const submitWord = useGameStore((s) => s.submitWord);
  const endTurn = useGameStore((s) => s.endTurn);
  const muted = useGameStore((s) => s.muted);
  const moveSound = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    // Placeholder path; ensure move.wav is added under public/assets/sounds.
    moveSound.current = new Audio('/assets/sounds/move.wav');
  }, []);
  const {
    requiredLength,
    startLetter,
    usedWords,
    dictionary,
    rules,
    wildcards,
    current,
  } = useGameStore();

  const validation = validateWord(word, {
    length: requiredLength,
    startLetter,
    usedWords,
    hasWord: (w) => hasWord(dictionary, w),
    noRepeats: rules.noRepeats,
    useWildcard,
  });

  const messages: Record<string, string> = {
    length: `Word must be ${requiredLength} letters`,
    start: `Word must start with ${startLetter}`,
    dictionary: 'Word not in dictionary',
    repeat: 'Word already used',
  };

  const handleSubmit = () => {
    const res = submitWord(word, useWildcard);
    if (res.accepted) {
      if (!muted) moveSound.current?.play();
      setWord('');
      setUseWildcard(false);
      endTurn();
    }
  };

  const canUseWildcard = wildcards[current] > 0;

  return (
    <div className="p-4 bg-white rounded shadow space-y-2">
      <div className="flex space-x-2 items-center">
        <label htmlFor="word-input" className="sr-only">
          Enter word
        </label>
        <input
          id="word-input"
          type="text"
          className="border p-1 rounded"
          value={word}
          onChange={(e) => setWord(e.target.value)}
        />
        <label htmlFor="use-wildcard" className="flex items-center space-x-1">
          <input
            id="use-wildcard"
            type="checkbox"
            checked={useWildcard}
            disabled={!canUseWildcard}
            onChange={() => setUseWildcard(!useWildcard)}
          />
          <span>Wildcard</span>
        </label>
        <button
          className="border px-2 bg-primary text-white rounded disabled:opacity-50"
          onClick={handleSubmit}
          disabled={!validation.accepted}
          aria-label="Submit word"
        >
          Submit
        </button>
      </div>
      {!validation.accepted && (word.length > 0 || requiredLength > 0) && (
        <div className="text-sm text-red-500">
          {messages[validation.reason ?? ''] || ''}
        </div>
      )}
    </div>
  );
}
