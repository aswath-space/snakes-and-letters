import Cell from './Cell';

export default function Board() {
  const cells = Array.from({ length: 100 }, (_, i) => <Cell key={i} index={i} />);
  return <div className="grid grid-cols-10 gap-1">{cells}</div>;
}
