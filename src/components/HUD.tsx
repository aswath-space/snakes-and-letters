import Dice from './Dice';
import { useGameStore } from '../store/useGameStore';

export interface HUDProps {}

export default function HUD(): JSX.Element {
  const { requiredLength, startLetter, wildcards, current, positions } =
    useGameStore();
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-4">
        <Dice />
        <div>Required: {requiredLength || '-'}</div>
        <div>Start: {startLetter}</div>
        <div>Current: P{current + 1}</div>
        <div>Wildcards: {wildcards[current]}</div>
      </div>
      <div className="flex space-x-4">
        <div className={current === 0 ? 'font-bold' : ''}>
          P1: {positions[0]}
        </div>
        <div className={current === 1 ? 'font-bold' : ''}>
          P2: {positions[1]}
        </div>
      </div>
    </div>
  );
}
