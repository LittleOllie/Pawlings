"use client";

import { GameButton } from "@/components/pawlings/game-button";
import type { DailyCareTaskState } from "@/types/dashboard";

interface DailyCareSectionProps {
  tasks: DailyCareTaskState[];
  onCheckIn: () => void;
  checkInLoading: boolean;
}

export function DailyCareSection({ tasks, onCheckIn, checkInLoading }: DailyCareSectionProps) {
  const checkIn = tasks.find((t) => t.id === "check_in");

  return (
    <section aria-labelledby="daily-care-heading" className="dashboard-glass rounded-[var(--radius-panel)] p-5 sm:p-6">
      <h2 id="daily-care-heading" className="font-display text-lg font-bold text-pawlings-white mb-4">
        Daily Care
      </h2>
      <ul className="space-y-3 mb-4">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex items-start gap-3 rounded-xl bg-black/15 px-3 py-3 border border-white/5"
          >
            <span
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/20 text-xs"
              aria-hidden
            >
              {task.completed ? "✓" : "○"}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-pawlings-white font-medium">{task.label}</p>
              <p className="text-xs text-pawlings-muted">
                +{task.rewardTreats} Treats
                {task.rewardXp ? ` · +${task.rewardXp} XP` : ""}
              </p>
            </div>
          </li>
        ))}
      </ul>
      {checkIn && !checkIn.completed ? (
        <GameButton type="button" fullWidth onClick={onCheckIn} loading={checkInLoading}>
          Check in today
        </GameButton>
      ) : (
        <p className="text-sm text-pawlings-muted text-center">Daily care looking good today.</p>
      )}
    </section>
  );
}
