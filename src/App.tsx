import React from 'react';
import Board from './components/Board';
import WordInput from './components/WordInput';
import HUD from './components/HUD';
import ToggleBar from './components/ToggleBar';

export default function App() {
  return (
    <div className="p-4 space-y-4">
      <HUD />
      <Board />
      <WordInput />
      <ToggleBar />
    </div>
  );
}
