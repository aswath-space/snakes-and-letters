import React from 'react';
import { useGameStore } from '../store/useGameStore';

export default function HUD() {
  const { requiredLength, startLetter, lastDie } = useGameStore();
  return (
    <div className="flex space-x-4">
      <div>Die: {lastDie}</div>
      <div>Required: {requiredLength}</div>
      <div>Start Letter: {startLetter}</div>
    </div>
  );
}
