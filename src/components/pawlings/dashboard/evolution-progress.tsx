import type { EvolutionStage } from "@/types/pawling";
import { EVOLUTION_MILESTONES } from "@/lib/pawling-placeholders";
import { cn } from "@/lib/utils";

interface EvolutionProgressProps {
  currentStage: EvolutionStage;
  className?: string;
}

const STAGE_ORDER: EvolutionStage[] = ["egg", "puppy", "growing", "adult"];

export function EvolutionProgress({ currentStage, className }: EvolutionProgressProps) {
  const currentIndex = STAGE_ORDER.indexOf(currentStage);

  return (
    <div className={cn("dashboard-glass rounded-[var(--radius-panel)] p-5 sm:p-6", className)}>
      <p className="section-eyebrow mb-2">Evolution Path</p>
      <h2 className="font-display text-xl font-bold text-pawlings-white mb-6">
        From egg to legend
      </h2>
      <ol className="evolution-track relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 sm:gap-4">
        {EVOLUTION_MILESTONES.map((milestone, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isLocked = index > currentIndex;

          return (
            <li
              key={milestone.id}
              className={cn(
                "evolution-track-step relative flex-1 text-center",
                isCurrent && "evolution-track-step--current",
                isLocked && "opacity-50"
              )}
            >
              <div
                className={cn(
                  "mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl",
                  "border-2 transition-all duration-300",
                  isComplete && "border-pawlings-lime bg-pawlings-lime/15",
                  isCurrent && "border-pawlings-yellow bg-pawlings-yellow/15 scale-110 shadow-[0_0_24px_rgba(255,201,40,0.25)]",
                  isLocked && "border-white/10 bg-white/5"
                )}
                aria-hidden
              >
                {milestone.emoji}
              </div>
              <p className="font-display font-bold text-pawlings-white text-sm">{milestone.label}</p>
              <p className="text-xs text-pawlings-muted mt-1 leading-snug px-1">{milestone.description}</p>
              {isLocked && (
                <span className="mt-2 inline-block text-[10px] uppercase tracking-widest text-pawlings-muted">
                  Locked
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
