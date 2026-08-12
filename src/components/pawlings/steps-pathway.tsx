import { pawlingsContent } from "@/config/pawlings-content";
import { cn } from "@/lib/utils";

const stepStyles = [
  {
    ring: "ring-pawlings-lime/40",
    node: "bg-pawlings-lime text-pawlings-navy-900",
    glow: "shadow-[0_0_32px_rgba(168,239,36,0.25)]",
    icon: (
      <svg viewBox="0 0 32 32" className="h-7 w-7" fill="currentColor" aria-hidden>
        <rect x="4" y="10" width="24" height="16" rx="4" opacity="0.35" />
        <rect x="6" y="12" width="20" height="12" rx="3" />
        <circle cx="22" cy="18" r="2" fill="currentColor" opacity="0.5" />
      </svg>
    ),
  },
  {
    ring: "ring-pawlings-purple/40",
    node: "bg-pawlings-purple text-pawlings-white",
    glow: "shadow-[0_0_32px_rgba(166,77,232,0.25)]",
    icon: (
      <svg viewBox="0 0 32 32" className="h-7 w-7" fill="currentColor" aria-hidden>
        <path d="M6 14c0-4 3-7 10-7s10 3 10 7v2H6v-2z" opacity="0.35" />
        <path d="M8 16h16v6a2 2 0 01-2 2H10a2 2 0 01-2-2v-6z" />
        <circle cx="12" cy="19" r="1.5" />
        <circle cx="20" cy="19" r="1.5" />
      </svg>
    ),
  },
  {
    ring: "ring-pawlings-orange/40",
    node: "bg-pawlings-orange text-pawlings-navy-900",
    glow: "shadow-[0_0_32px_rgba(255,148,24,0.25)]",
    icon: (
      <svg viewBox="0 0 32 32" className="h-7 w-7" fill="currentColor" aria-hidden>
        <path d="M16 4l2.5 7.5H26l-6 4.5 2.5 7.5L16 19l-6.5 4.5 2.5-7.5-6-4.5h7.5L16 4z" opacity="0.35" />
        <path d="M16 8l1.8 5.5h5.9l-4.8 3.5 1.8 5.5L16 17.5l-4.7 3.5 1.8-5.5-4.8-3.5h5.9L16 8z" />
      </svg>
    ),
  },
] as const;

export function StepsPathway() {
  const steps = pawlingsContent.steps.items;
  const intro = pawlingsContent.steps.intro;

  return (
    <div className="pathway relative mx-auto max-w-4xl">
      <p className="text-center text-pawlings-muted text-base sm:text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
        {intro}
      </p>
      <div className="pathway-line hidden sm:block" aria-hidden />

      <ol className="relative grid gap-10 sm:grid-cols-3 sm:gap-6">
        {steps.map((step, i) => {
          const style = stepStyles[i];
          return (
            <li key={step.title} className="pathway-step relative flex sm:flex-col sm:items-center sm:text-center">
              <div className="pathway-mobile-line sm:hidden" aria-hidden />

              <div
                className={cn(
                  "pathway-node shrink-0 flex h-14 w-14 items-center justify-center rounded-2xl ring-4",
                  style.node,
                  style.ring,
                  style.glow
                )}
              >
                {style.icon}
              </div>

              <div className="ml-5 sm:ml-0 sm:mt-5 flex-1">
                <p className="text-xs font-display font-bold uppercase tracking-widest text-pawlings-lime mb-1">
                  Step {String(i + 1).padStart(2, "0")}
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
