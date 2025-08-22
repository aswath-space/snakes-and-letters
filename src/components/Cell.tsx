
export default function Cell({ index }: { index: number }) {
  return (
    <div className="w-8 h-8 border flex items-center justify-center text-xs">
      {index + 1}
    </div>
  );
}
