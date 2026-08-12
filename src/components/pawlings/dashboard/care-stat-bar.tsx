"use client";

import { cn } from "@/lib/utils";

interface CareStatBarProps {
  label: string;
  emoji: string;
  value: number;
  helper?: string;
}

export function CareStatBar({ label, emoji, value, helper }: CareStatBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="font-display text-sm font-bold text-pawlings-white">
          <span aria-hidden>{emoji}</span> {label}
        </span>
        <span className="text-sm text-pawlings-muted tabular-nums">{clamped}%</span>
      </div>
      <div
        className="h-3 rounded-full bg-black/30 overflow-hidden border border-white/5"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label} ${clamped} percent`}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            label === "Hunger" && "bg-gradient-to-r from-amber-500 to-orange-400",
            label === "Happiness" && "bg-gradient-to-r from-pink-400 to-rose-300",
            label === "Bond" && "bg-gradient-to-r from-violet-400 to-indigo-300",
            label === "Growth" && "bg-gradient-to-r from-pawlings-lime/90 to-emerald-300"
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {helper ? <p className="text-xs text-pawlings-muted">{helper}</p> : null}
    </div>
  );
}

interface GrowthProgressProps {
  xp: number;
  stage: 1 | 2 | 3;
  target: number;
}

export function GrowthProgress({ xp, stage, target }: GrowthProgressProps) {
  const atMax = stage >= 3 && xp >= target;
  const pct = atMax ? 100 : Math.min(100, Math.round((xp / target) * 100));

  return (
    <CareStatBar
      label="Growth"
      emoji="⭐"
      value={pct}
      helper={
        atMax
          ? "Max growth stage reached for now."
          : `${xp} / ${target} XP to next growth stage`
      }
    />
  );
}
