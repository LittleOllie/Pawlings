import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

interface GameCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  accent?: "lime" | "purple" | "orange" | "none";
  /** Premium collectible styling with hover shine */
  collectible?: boolean;
  /** Gentle lift + shine on hover */
  tilt?: boolean;
}

const accentRing = {
  lime: "ring-pawlings-lime/25",
  purple: "ring-pawlings-purple/25",
  orange: "ring-pawlings-orange/25",
  none: "ring-pawlings-border",
};

export function GameCard({
  children,
  className,
  accent = "none",
  collectible = false,
  tilt = false,
  ...props
}: GameCardProps) {
  return (
    <div
      className={cn(
        collectible ? "collectible-card ring-1" : "game-card ring-1",
        tilt && collectible && "collectible-card-tilt",
        accentRing[accent],
        className
      )}
      {...props}
    >
      {collectible && tilt && (
        <span className="collectible-card-shine" aria-hidden />
      )}
      {children}
    </div>
  );
}
