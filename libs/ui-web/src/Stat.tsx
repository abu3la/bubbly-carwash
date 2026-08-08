export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="bb-stat">
      <b>{value}</b>
      <span>{label}</span>
    </div>
  );
}
