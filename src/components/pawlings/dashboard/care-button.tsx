"use client";

import { playPawlingsSound } from "@/lib/pawlings-sound";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface CareButtonProps {
  label?: string;
  className?: string;
}

export function CareButton({ label = "Feed Pawling", className }: CareButtonProps) {
  const [feeding, setFeeding] = useState(false);

  const handleClick = () => {
    if (feeding) return;
    setFeeding(true);
    playPawlingsSound("feed");
    window.setTimeout(() => setFeeding(false), 1200);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={feeding}
      className={cn(
        "care-button group relative w-full overflow-hidden rounded-[var(--radius-panel)]",
        "bg-gradient-to-b from-pawlings-lime to-[#8fd018] px-8 py-5",
        "font-display text-lg font-bold text-pawlings-navy-900",
        "shadow-elevation-2 transition-transform active:scale-[0.98]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pawlings-lime",
        feeding && "animate-care-pulse",
        className
      )}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {feeding ? "Nom nom… 🦴" : `🦴 ${label}`}
      </span>
      <span className="care-button-shimmer pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100" aria-hidden />
    </button>
  );
}
