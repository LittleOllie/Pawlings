import { pawlingsContent } from "@/config/pawlings-content";
import { cn } from "@/lib/utils";

const colorStyles = {
  lime: {
    ring: "ring-pawlings-lime/40",
    node: "bg-pawlings-lime text-pawlings-navy-900",
    glow: "shadow-[0_0_32px_rgba(168,239,36,0.25)]",
    line: "from-pawlings-lime/60",
  },
  purple: {
    ring: "ring-pawlings-purple/40",
    node: "bg-pawlings-purple text-pawlings-white",
    glow: "shadow-[0_0_32px_rgba(166,77,232,0.25)]",
    line: "from-pawlings-purple/60",
  },
  orange: {
    ring: "ring-pawlings-orange/40",
    node: "bg-pawlings-orange text-pawlings-navy-900",
    glow: "shadow-[0_0_32px_rgba(255,148,24,0.25)]",
    line: "from-pawlings-orange/60",
  },
  yellow: {
    ring: "ring-pawlings-yellow/40",
    node: "bg-pawlings-yellow text-pawlings-navy-900",
    glow: "shadow-[0_0_32px_rgba(255,201,40,0.25)]",
    line: "from-pawlings-yellow/60",
  },
} as const;

export function EvolutionJourney() {
  const steps = pawlingsContent.steps.items;
  const intro = pawlingsContent.steps.intro;

  return (
    <div className="evolution-journey relative mx-auto max-w-5xl">
      <p className="text-center text-pawlings-muted text-base sm:text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
        {intro}
      </p>

      <ol className="relative grid gap-8 sm:grid-cols-4 sm:gap-4">
        {steps.map((step, i) => {
          const style = colorStyles[step.color];
          const isLast = i === steps.length - 1;

          return (
            <li
              key={step.title}
              className="evolution-journey-step relative flex sm:flex-col sm:items-center sm:text-center"
            >
              {!isLast && (
                <>
                  <span
                    className="evolution-journey-connector hidden sm:block absolute top-7 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-gradient-to-r to-transparent opacity-60"
                    style={{
                      backgroundImage: `linear-gradient(to right, var(--color-pawlings-lime), transparent)`,
                    }}
                    aria-hidden
                  />
                  <span
                    className="evolution-journey-arrow sm:hidden absolute left-7 top-14 text-pawlings-lime/50 text-lg"
                    aria-hidden
                  >
                    ↓
                  </span>
                </>
              )}

              <div
                className={cn(
                  "evolution-journey-node shrink-0 flex h-14 w-14 items-center justify-center rounded-2xl ring-4 text-2xl",
                  "transition-transform duration-300 hover:scale-105",
                  style.node,
                  style.ring,
                  style.glow
                )}
              >
                {step.emoji}
              </div>

              <div className="ml-5 sm:ml-0 sm:mt-5 flex-1">
                <p className="text-xs font-display font-bold uppercase tracking-widest text-pawlings-lime mb-1">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="font-display text-lg font-bold text-pawlings-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-pawlings-muted leading-relaxed">
                  {step.description}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
