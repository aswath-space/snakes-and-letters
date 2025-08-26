// Heads-up display showing game stats and controls
import { useEffect } from 'react';
import Dice from './Dice';
import { useGameStore } from '../store/useGameStore';

export default function HUD() {
  const {
    requiredLength,
    startLetter,
    wildcards,
    current,
    rules,
    remainingTime,
  } = useGameStore();
  const decrementTimer = useGameStore((s) => s.decrementTimer);
  const endTurn = useGameStore((s) => s.endTurn);

  useEffect(() => {
    if (!rules.timer || !requiredLength) return;
    const id = setInterval(() => {
      decrementTimer();
    }, 1000);
    return () => clearInterval(id);
  }, [rules.timer, requiredLength, decrementTimer]);

  useEffect(() => {
    if (rules.timer && requiredLength && remainingTime === 0) {
      endTurn();
    }
  }, [rules.timer, requiredLength, remainingTime, endTurn]);
  return (
    <div className="p-4 bg-white rounded shadow flex flex-col space-y-2 text-primary">
      <Dice />
      {/* Display current turn information */}
      <div>Required: {requiredLength || '-'}</div>
      <div>Start: {startLetter}</div>
      <div>Current: {rules.mode === 'zen' ? 'P1' : `P${current + 1}`}</div>
      <div>Wildcards: {wildcards[current]}</div>
      {rules.timer && <div>Time: {remainingTime || '-'}</div>}
    </div>
  );
}
