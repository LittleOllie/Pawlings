import { cn } from "@/lib/utils";

interface StatusCardProps {
  label: string;
  value: number;
  className?: string;
}

function barColor(value: number) {
  if (value >= 75) return "bg-pawlings-lime";
  if (value >= 45) return "bg-pawlings-yellow";
  return "bg-pawlings-orange";
}

export function StatusCard({ label, value, className }: StatusCardProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const filled = Math.round(clamped / 10);

  return (
    <div
      className={cn(
        "dashboard-glass rounded-[var(--radius-control)] p-4 transition-transform duration-200 hover:scale-[1.02]",
        className
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-display text-sm font-bold text-pawlings-white">{label}</span>
        <span className="text-sm tabular-nums text-pawlings-muted">{clamped}%</span>
      </div>
      <div
        className="font-mono text-xs tracking-widest text-pawlings-lime mb-1"
        aria-hidden
      >
        {"█".repeat(filled)}
        {"░".repeat(10 - filled)}
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden" role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100} aria-label={`${label} ${clamped}%`}>
        <div
          className={cn("h-full rounded-full transition-all duration-500", barColor(clamped))}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
