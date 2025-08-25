import Dice from './Dice';
import { useGameStore } from '../store/useGameStore';

export default function HUD() {
  const { requiredLength, startLetter, wildcards, current, positions, rules } =
    useGameStore();
  return (
    <div className="p-4 bg-white rounded shadow flex flex-col space-y-2 text-primary">
      <Dice />
      <div>Required: {requiredLength || '-'}</div>
      <div>Start: {startLetter}</div>
      <div>Current: {rules.mode === 'zen' ? 'P1' : `P${current + 1}`}</div>
      <div>Wildcards: {wildcards[current]}</div>
      <div className="pt-2">
        <div className={current === 0 ? 'font-bold' : ''}>
          P1: {positions[0]}
        </div>
        {rules.mode !== 'zen' && (
          <div className={current === 1 ? 'font-bold' : ''}>
            P2: {positions[1]}
          </div>
        )}
      </div>
    </div>
  );
}
