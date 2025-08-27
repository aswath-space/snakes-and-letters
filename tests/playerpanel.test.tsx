import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import PlayerPanel from '../src/components/PlayerPanel';
import { useGameStore } from '../src/store/useGameStore';
import { defaultRules } from '../src/engine';

describe('PlayerPanel', () => {
  it('renders both players and highlights current in bot mode', () => {
    act(() => {
      useGameStore.setState({
        current: 1,
        rules: {
          ...defaultRules,
          mode: 'bot',
          bot: { name: 'HAL', skill: 'easy' },
        },
        wildcards: { 0: 2, 1: 1 },
      });
    });
    render(<PlayerPanel />);
    expect(screen.getByText('Player 1')).toBeTruthy();
    expect(screen.getByText('HAL')).toBeTruthy();
    expect(screen.getByText('Wildcards: 2')).toBeTruthy();
    expect(screen.getByText('Wildcards: 1')).toBeTruthy();
    const active = screen.getByText('HAL').closest('[aria-current="true"]');
    expect(active).toBeTruthy();
  });
});
