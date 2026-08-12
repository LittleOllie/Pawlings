"use client";

import Image from "next/image";
import { Lock } from "lucide-react";
import { pawlingsContent } from "@/config/pawlings-content";
import { GameCard } from "./game-card";
import { PawlingDogImage } from "./pawling-dog-image";
import { PawlingsColoredHeading } from "./pawlings-colored-heading";
import { cn } from "@/lib/utils";

type RoadmapPhase = (typeof pawlingsContent.roadmap.phases)[number];

const stepAccent = {
  lime: "lime",
  orange: "orange",
  purple: "purple",
} as const;

const phaseTagVariant = ["phase-1", "phase-2", "phase-3"] as const;

const phaseTitleHighlights: Record<string, string> = {
  "phase-1": "List",
  "phase-2": "Pawlings",
  "phase-3": "Secret",
};

const phaseTaglineClass: Record<string, string> = {
  "phase-1": "text-pawlings-lime/90",
  "phase-2": "text-pawlings-purple/90",
  "phase-3": "text-pawlings-orange/90",
};

const pawTrailColors = [
  "#a8ef24",
  "#f448b8",
  "#a64de8",
  "#ffc928",
];

function PhaseHeader({ phase }: { phase: RoadmapPhase }) {
  const highlight = phaseTitleHighlights[phase.id] ?? phase.title.split(" ").pop() ?? phase.title;
  const taglineClass = phaseTaglineClass[phase.id] ?? "text-pawlings-muted";

  return (
    <header className="mb-5 text-center sm:text-left">
      <PawlingsColoredHeading
        as="h3"
        highlight={highlight}
        className="font-display text-2xl sm:text-3xl font-bold mb-1"
      >
        {phase.title}
      </PawlingsColoredHeading>
      {"tagline" in phase && phase.tagline && (
        <p className={cn("text-sm sm:text-base italic font-medium", taglineClass)}>
          {phase.tagline}
        </p>
      )}
    </header>
  );
}

function PawTrail({ className }: { className?: string }) {
  return (
    <div className={cn("roadmap-paw-trail flex justify-center gap-3 py-4", className)} aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="roadmap-paw-print text-xl sm:text-2xl"
          style={{
            animationDelay: `${i * 0.15}s`,
            color: pawTrailColors[i],
            filter: `drop-shadow(0 0 6px ${pawTrailColors[i]}88)`,
          }}
        >
          🐾
        </span>
      ))}
    </div>
  );
}

function hasItems(
  phase: RoadmapPhase
): phase is RoadmapPhase & {
  items: readonly {
    title: string;
    description?: string;
    emoji: string;
    accent?: keyof typeof stepAccent;
    visual?: string;
  }[];
} {
  return "items" in phase && Array.isArray(phase.items);
}

function hasTags(phase: RoadmapPhase): phase is RoadmapPhase & { tags: readonly string[] } {
  return "tags" in phase && Array.isArray(phase.tags);
}

export function RoadmapSection() {
  const roadmap = pawlingsContent.roadmap;
  const assets = pawlingsContent.assets;

  return (
    <div className="roadmap-trail relative mx-auto max-w-4xl">
      <p className="text-center text-base sm:text-lg font-display font-bold mb-8 tracking-wide roadmap-trail-label">
        {roadmap.trailLabel} 🐾
      </p>

      <ol className="relative space-y-0">
        {roadmap.phases.map((phase, index) => {
          const isMystery = "mysterious" in phase && phase.mysterious;
          const isLast = index === roadmap.phases.length - 1;

          return (
            <li key={phase.id} className={cn("relative", index > 0 && "pt-2 sm:pt-4")}>
              {!isLast && (
                <div className="roadmap-trail-spine absolute left-1/2 top-full z-0 hidden -translate-x-1/2 sm:block" aria-hidden />
              )}

              <article
                className={cn(
                  "roadmap-stop relative z-10",
                  !isLast ? "pb-4 sm:pb-6" : "pb-2",
                  isMystery && "roadmap-stop--mystery"
                )}
              >
                <span
                  className={cn(
                    "roadmap-stop-glow pointer-events-none absolute inset-x-4 -inset-y-2 rounded-3xl blur-2xl opacity-60",
                    `roadmap-stop-glow--${phaseTagVariant[index] ?? "phase-1"}`
                  )}
                  aria-hidden
                />

                {/* Phase marker — dog tag */}
                <div className="flex justify-center mb-5">
                  <span
                    className={cn(
                      "roadmap-dog-tag",
                      `roadmap-dog-tag--${phaseTagVariant[index] ?? "phase-1"}`
                    )}
                  >
                    <span className="roadmap-dog-tag-hole" aria-hidden />
                    {phase.label}
                  </span>
                </div>

                <GameCard
                  collectible
                  tilt={!isMystery}
                  accent={index === 0 ? "lime" : index === 1 ? "purple" : "orange"}
                  className={cn(
                    "roadmap-phase-card relative p-5 sm:p-7 text-center sm:text-left",
                    `roadmap-phase-card--${phaseTagVariant[index] ?? "phase-1"}`,
                    isMystery && "locked-collectible overflow-hidden"
                  )}
                >
                  {isMystery ? (
                    <MysteryDen phase={phase} symbol={roadmap.mysterySymbol} text={roadmap.mysteryText} />
                  ) : (
                    <>
                      <PhaseHeader phase={phase} />

                      {hasTags(phase) && (
                        <ul className="flex flex-wrap justify-center sm:justify-start gap-2 mb-2">
                          {phase.tags.map((tag, i) => (
                            <li key={tag} className="personality-stamp text-[0.65rem]">
                              {["📋", "🐾", "🌱"][i]} {tag}
                            </li>
                          ))}
                        </ul>
                      )}

                      {hasItems(phase) && (
                        <div className="mt-6 space-y-5">
                          <div className="hidden sm:flex items-end justify-between gap-2 px-2 -mb-2" aria-hidden>
                            <PawlingDogImage
                              src={assets.dog1}
                              alt=""
                              decorative
                              className="w-16 opacity-90"
                              floatDelay="short"
                            />
                            <div className="flex-1 flex items-center justify-center gap-2 pb-4">
                              <span className="text-2xl animate-logo-float">🐶</span>
                              <span className="text-pawlings-yellow text-sm">· · ·</span>
                              <span className="text-2xl animate-logo-float" style={{ animationDelay: "0.5s" }}>🐕</span>
                            </div>
                            <PawlingDogImage
                              src={assets.dog2}
                              alt=""
                              decorative
                              mirrored
                              className="w-16 opacity-90"
                              floatDelay="long"
                            />
                          </div>

                          <ol className="grid gap-4 sm:grid-cols-3">
                            {phase.items.map((item, stepIndex) => (
                              <li
                                key={item.title}
                                className="roadmap-adventure-step rounded-2xl border border-white/10 bg-black/20 p-4 text-left transition-transform hover:scale-[1.03]"
                              >
                                <div
                                  className={cn(
                                    "mb-3 flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ring-4",
                                    item.accent === "lime" && "bg-pawlings-lime text-pawlings-navy-900 ring-pawlings-lime/30",
                                    item.accent === "orange" && "bg-pawlings-orange text-pawlings-navy-900 ring-pawlings-orange/30",
                                    item.accent === "purple" && "bg-pawlings-purple text-white ring-pawlings-purple/30"
                                  )}
                                >
                                  {item.emoji}
                                </div>
                                <p
                                  className={cn(
                                    "text-[10px] font-display font-bold uppercase tracking-widest mb-1",
                                    item.accent === "lime" && "text-pawlings-lime",
                                    item.accent === "orange" && "text-pawlings-orange",
                                    item.accent === "purple" && "text-pawlings-purple"
                                  )}
                                >
                                  Step {stepIndex + 1}
                                </p>
                                <p className="font-display font-bold text-pawlings-white text-sm leading-snug">
                                  {item.title}
                                </p>
                                {item.description && (
                                  <p className="text-xs text-pawlings-muted mt-1.5 leading-relaxed">
                                    {item.description}
                                  </p>
                                )}
                                {item.visual === "evolution" && (
                                  <div className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-pawlings-orange/10 py-2 border border-pawlings-orange/20">
                                    <span className="text-xl">🐶</span>
                                    <span className="text-xs text-pawlings-yellow">✨</span>
                                    <span className="text-xl">🐕</span>
                                  </div>
                                )}
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </>
                  )}
                </GameCard>
              </article>

              {!isLast && <PawTrail />}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function MysteryDen({
  phase,
  symbol,
  text,
}: {
  phase: RoadmapPhase;
  symbol: string;
  text: string;
}) {
  return (
    <>
      <PhaseHeader phase={phase} />

      <div className="relative mt-2">
        <div className="mx-auto flex h-36 w-full max-w-sm items-end justify-center relative">
          <Image
            src={pawlingsContent.assets.dog2}
            alt=""
            width={200}
            height={200}
            className="h-28 w-auto object-contain locked-collectible-silhouette opacity-40"
            aria-hidden
          />
          <div className="locked-collectible-overlay rounded-2xl bg-black/20">
            <span className="font-display text-4xl font-bold text-pawlings-orange/40 mb-1 tracking-widest">
              {symbol}
            </span>
            <span className="locked-collectible-badge">
              <Lock className="h-3 w-3" aria-hidden />
              Sniffing soon
            </span>
          </div>
        </div>
        <p className="text-sm text-pawlings-muted/80 text-center sm:text-left mt-4">{text}</p>
      </div>
    </>
  );
}
