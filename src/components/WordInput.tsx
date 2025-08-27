import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { validateWord } from '../engine/validate';
import { getHints, hasWord } from '../dictionary/loader';

export default function WordInput() {
  const [word, setWord] = useState('');
  const [useWildcard, setUseWildcard] = useState(false);
  const [hints, setHints] = useState<string[]>([]);

  const submitWord = useGameStore((s) => s.submitWord);
  const endTurn = useGameStore((s) => s.endTurn);
  const muted = useGameStore((s) => s.muted);

  const {
    requiredLength,
    startLetter,
    usedWords,
    dictionary,
    rules,
    wildcards,
    current,
    rolling,
  } = useGameStore();

  // Preload move sound (browser-only)
  const moveSound = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    // File should exist at /public/assets/sounds/move.wav
    moveSound.current = new Audio('/assets/sounds/move.wav');
  }, []);

  // Validation (guard when no turn/length yet)
  const validation =
    requiredLength > 0
      ? validateWord(word, {
          length: requiredLength,
          startLetter,
          usedWords,
          hasWord: (w) => hasWord(dictionary, w),
          noRepeats: rules.noRepeats,
          useWildcard,
        })
      : { accepted: false as const, reason: undefined as undefined };

  useEffect(() => {
    // Reset hints when constraints change
    setHints([]);
  }, [requiredLength, startLetter]);

  const messages: Record<string, string> = {
    length: `Word must be ${requiredLength} letters`,
    start: `Word must start with ${startLetter}`,
    dictionary: 'Word not in dictionary',
    repeat: 'Word already used',
    overshoot: 'Word exceeds remaining squares. Turn skipped.',
  };

  const canUseWildcard = wildcards[current] > 0;

  const handleSubmit = () => {
    if (rolling) return;
    const res = submitWord(word, useWildcard);

    if (res.accepted) {
      if (!muted) {
        // Avoid unhandled promise rejection on autoplay-restricted browsers
        moveSound.current?.play().catch(() => {});
      }
      setWord('');
      setUseWildcard(false);
      endTurn();
      setHints([]); // clear hints on successful turn
      return;
    }

    if (res.reason === 'overshoot') {
      // Keep UX consistent with your earlier behavior
      alert('Word exceeds remaining squares. Turn skipped.');
    }
  };

  const handleHint = () => {
    if (rolling) return;
    setHints(getHints(dictionary, startLetter, requiredLength));
  };

  // Safer key for message lookup
  const reasonKey = (validation as { reason?: string }).reason;

  return (
    <div className="p-4 bg-white rounded shadow space-y-2">
      {/* Use a form to centralize submit + Enter key handling */}
      <form
        className="flex items-start space-x-2"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="flex-1">
          <label htmlFor="word-input" className="sr-only">
            Enter word
          </label>
          <input
            id="word-input"
            type="text"
            className="border p-1 rounded w-full"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            disabled={rolling}
            aria-invalid={!validation.accepted && requiredLength > 0 && word.length > 0}
            aria-describedby={!validation.accepted ? 'word-error' : undefined}
          />
        </div>

        <div className="flex flex-col space-y-2">
          {/* Optionally bypass starting-letter rule */}
          <label htmlFor="use-wildcard" className="flex items-center space-x-1">
            <input
              id="use-wildcard"
              type="checkbox"
              checked={useWildcard}
              disabled={!canUseWildcard || rolling}
              onChange={() => setUseWildcard(!useWildcard)}
            />
            <span>Wildcard</span>
          </label>

          <button
            type="submit"
            className="border px-2 bg-primary text-white rounded disabled:opacity-50"
            disabled={!validation.accepted || rolling}
            aria-label="Submit word"
          >
            Submit
          </button>

          <button
            type="button"
            className="border px-2 rounded disabled:opacity-50"
            onClick={() => {
              if (rolling) return;
              setWord('');
              setUseWildcard(false);
              endTurn();
              setHints([]);
            }}
            disabled={rolling}
          >
            Concede
          </button>

          <button
            type="button"
            className="border px-2 rounded disabled:opacity-50"
            onClick={handleHint}
            aria-label="Show hints"
            disabled={rolling || requiredLength <= 0}
          >
            Hint
          </button>
        </div>
      </form>

      {/* Inline validation feedback */}
      {!validation.accepted && requiredLength > 0 && word.length > 0 && (
        <div id="word-error" className="text-sm text-red-500" aria-live="polite">
          {reasonKey ? messages[reasonKey] ?? '' : ''}
        </div>
      )}

      {/* Hints list */}
      {hints.length > 0 && (
        <ul className="text-sm text-gray-500 flex flex-wrap gap-1">
          {hints.map((h) => (
            <li key={h} className="bg-gray-100 px-1 rounded">
              {h}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}