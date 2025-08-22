import React, { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { validateWord } from '../engine/validate';
import { hasWord } from '../dictionary/loader';

export default function WordInput() {
  const [word, setWord] = useState('');
  const [useWildcard, setUseWildcard] = useState(false);
  const submitWord = useGameStore((s) => s.submitWord);
  const endTurn = useGameStore((s) => s.endTurn);
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
      setWord('');
      setUseWildcard(false);
      endTurn();
    }
  };

  const canUseWildcard = wildcards[current] > 0;

  return (
    <div className="space-y-2">
      <div className="flex space-x-2 items-center">
        <input
          className="border p-1"
          value={word}
          onChange={(e) => setWord(e.target.value)}
        />
        <label className="flex items-center space-x-1">
          <input
            type="checkbox"
            checked={useWildcard}
            disabled={!canUseWildcard}
            onChange={() => setUseWildcard(!useWildcard)}
          />
          <span>Wildcard</span>
        </label>
        <button
          className="border px-2"
          onClick={handleSubmit}
          disabled={!validation.accepted}
        >
          Submit
        </button>
        <button className="border px-2" onClick={endTurn}>
          End Turn
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
