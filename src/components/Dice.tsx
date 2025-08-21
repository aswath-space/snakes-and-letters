import React from 'react';
import { useGameStore } from '../store/useGameStore';

export default function Dice() {
  const { lastDie, roll } = useGameStore();
  const faces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
  return (
    <button
      className="w-12 h-12 border rounded flex items-center justify-center text-2xl"
      onClick={roll}
      aria-label="Roll die"
    >
      {lastDie ? faces[lastDie - 1] : '🎲'}
    </button>
  );
}
