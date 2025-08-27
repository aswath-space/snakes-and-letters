// Visual dice component that displays the current roll
import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store/useGameStore';

const faces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

export default function Dice() {
  const { lastDie, positions, current, rules } = useGameStore();
  const endTurn = useGameStore((s) => s.endTurn);
  const muted = useGameStore((s) => s.muted);
  const finishRoll = useGameStore((s) => s.finishRoll);
  const rollSound = useRef<HTMLAudioElement | null>(null);
  const [display, setDisplay] = useState<number>(0);
  const [rolling, setRolling] = useState(false);

  useEffect(() => {
    rollSound.current = new Audio('/assets/sounds/roll.wav');
  }, []);

  useEffect(() => {
    if (lastDie === 0) return;
    if (!muted) rollSound.current?.play();
    setRolling(true);
    const interval = setInterval(() => {
      setDisplay(Math.floor(Math.random() * 6) + 1);
    }, 100);
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setDisplay(lastDie);
      setRolling(false);
      finishRoll();
      const remaining = rules.boardSize - 1 - positions[current];
      if (lastDie - 1 > remaining) {
        alert('Need exact roll to finish. Turn skipped.');
        endTurn();
      }
    }, 3000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [lastDie, positions, current, rules.boardSize, endTurn, muted]);

  const face = display ? faces[display - 1] : '';
  return (
    <div
      className={`w-12 h-12 border rounded flex items-center justify-center text-2xl bg-secondary text-white ${rolling ? 'animate-spin' : ''}`}
    >
      {face}
    </div>
  );
}
