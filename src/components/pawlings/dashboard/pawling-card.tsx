"use client";

import Image from "next/image";
import type { PawlingCompanion } from "@/types/pawling";
import { cn } from "@/lib/utils";

interface PawlingCardProps {
  pawling: PawlingCompanion;
  className?: string;
}

export function PawlingCard({ pawling, className }: PawlingCardProps) {
  return (
    <article
      className={cn(
        "dashboard-glass relative overflow-hidden rounded-[var(--radius-panel)] p-6 sm:p-8",
        "transition-transform duration-300 hover:scale-[1.01]",
        className
      )}
    >
      <div className="relative mx-auto mb-6 flex h-48 w-48 items-end justify-center sm:h-56 sm:w-56">
        <Image
          src={pawling.imageUrl}
          alt=""
          width={480}
          height={480}
          className="h-full w-auto object-contain animate-logo-float"
          priority
        />
      </div>
      <div className="text-center space-y-2">
        <p className="font-display text-3xl font-bold text-pawlings-white">{pawling.name}</p>
        <p className="text-sm text-pawlings-muted">
          Token #{pawling.tokenId} · {pawling.ageDays} days old
        </p>
        <span className="inline-flex items-center gap-2 rounded-full border border-pawlings-lime/40 bg-pawlings-lime/10 px-4 py-1.5 font-display text-sm font-bold text-pawlings-lime">
          {pawling.stageLabel}
        </span>
      </div>
    </article>
  );
}
