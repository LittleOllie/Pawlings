"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { moodLabel } from "@/lib/dashboard/care";
import type { Pawling } from "@/types/dashboard";

interface MyPawlingsRowProps {
  pawlings: Pawling[];
  selectedTokenId: string | null;
  onSelect: (tokenId: string) => void;
}

export function MyPawlingsRow({ pawlings, selectedTokenId, onSelect }: MyPawlingsRowProps) {
  return (
    <section aria-labelledby="my-pawlings-heading">
      <h2 id="my-pawlings-heading" className="font-display text-xl font-bold text-pawlings-white mb-4">
        My Pawlings
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory lg:grid lg:grid-cols-3 xl:grid-cols-4 lg:overflow-visible">
        {pawlings.map((p) => {
          const selected = p.tokenId === selectedTokenId;
          return (
            <button
              key={p.tokenId}
              type="button"
              onClick={() => onSelect(p.tokenId)}
              className={cn(
                "snap-start shrink-0 w-[9.5rem] sm:w-[10.5rem] rounded-[var(--radius-panel)] p-3 text-left transition-transform",
                "border min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pawlings-lime",
                selected
                  ? "border-pawlings-lime/50 bg-pawlings-lime/10 scale-[1.02]"
                  : "border-white/10 bg-white/5 hover:bg-white/8"
              )}
              aria-pressed={selected}
              aria-label={`Select ${p.name}, Pawling number ${p.tokenId}`}
            >
              <div className="relative h-24 sm:h-28 mb-2 flex items-end justify-center">
                <Image
                  src={p.image}
                  alt=""
                  width={120}
                  height={120}
                  className="max-h-full w-auto object-contain drop-shadow-lg"
                />
              </div>
              <p className="font-display font-bold text-pawlings-white truncate">{p.name}</p>
              <p className="text-xs text-pawlings-muted">#{p.tokenId}</p>
              <p className="text-xs text-pawlings-muted mt-1">
                Stage {p.growthStage} · {moodLabel(p)}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
