import { PlayerId, useGameStore } from '../store/useGameStore';

export default function PlayerPanel() {
  const { current, wildcards, rules } = useGameStore();
  const playerTwoName =
    rules.mode === 'bot' ? (rules.bot?.name ?? 'Player 2') : 'Player 2';

  const players: { id: PlayerId; name: string }[] = [
    { id: 0, name: 'Player 1' },
    { id: 1, name: playerTwoName },
  ];

  return (
    <div className="p-4 bg-white rounded shadow space-y-2 text-primary">
      {players.map((p) => (
        <div
          key={p.id}
          className={`flex justify-between ${
            current === p.id ? 'font-bold' : ''
          }`}
          aria-current={current === p.id ? 'true' : undefined}
        >
          <span>{p.name}</span>
          <span>Wildcards: {wildcards[p.id]}</span>
        </div>
      ))}
    </div>
  );
}
