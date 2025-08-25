// Visual dice component that can be rolled to produce a value
import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';

const faces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

// Sound files live under /public/assets/sounds; actual files are not committed.

interface DiceProps {
  value?: number;
}

export default function Dice({ value }: DiceProps) {
  const muted = useGameStore((s) => s.muted);
  const rollSound = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    // Placeholder path; ensure roll.wav is added under public/assets/sounds.
    rollSound.current = new Audio('/assets/sounds/roll.wav');
  }, []);
  if (typeof value === 'number') {
    return (
      <div className="w-12 h-12 border rounded flex items-center justify-center text-2xl bg-secondary text-white">
        {faces[value - 1]}
      </div>
    );
  }

  const { lastDie, roll } = useGameStore();
  return (
    <button
      className="w-12 h-12 border rounded flex items-center justify-center text-2xl bg-secondary text-white"
      onClick={() => {
        roll();
        // Play sound effect when not muted
        if (!muted) rollSound.current?.play();
      }}
      aria-label="Roll die"
      title="Roll"
    >
      {lastDie ? faces[lastDie - 1] : 'Roll'}
    </button>
  );
}
