"use client";

import Image from "next/image";
import type { Pawling } from "@/types/dashboard";
import { xpToNextStage } from "@/lib/dashboard/care";
import { CareStatBar, GrowthProgress } from "./care-stat-bar";
import { GameButton } from "@/components/pawlings/game-button";

interface SelectedPawlingPanelProps {
  pawling: Pawling;
  treats: number;
  feedCost: number;
  feedMinutesLeft: number | null;
  playMinutesLeft: number | null;
  onFeed: () => void;
  onPlay: () => void;
  feedLoading: boolean;
  playLoading: boolean;
  actionMessage: string | null;
}

export function SelectedPawlingPanel({
  pawling,
  treats,
  feedCost,
  feedMinutesLeft,
  playMinutesLeft,
  onFeed,
  onPlay,
  feedLoading,
  playLoading,
  actionMessage,
}: SelectedPawlingPanelProps) {
  const growth = xpToNextStage(pawling.xp);

  return (
    <section
      aria-labelledby="selected-pawling-heading"
      className="dashboard-glass rounded-[var(--radius-panel)] p-5 sm:p-6 lg:p-8"
    >
      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <div className="text-center lg:text-left">
          <div className="relative mx-auto lg:mx-0 h-48 sm:h-56 lg:h-64 w-full max-w-xs flex items-end justify-center">
            <Image
              src={pawling.image}
              alt=""
              width={280}
              height={280}
              className="max-h-full w-auto object-contain drop-shadow-2xl animate-logo-float"
              priority
            />
          </div>
          <h2 id="selected-pawling-heading" className="font-display text-2xl sm:text-3xl font-bold text-pawlings-white mt-4">
            {pawling.name}
          </h2>
          <p className="text-pawlings-muted text-sm mt-1">Pawling #{pawling.tokenId}</p>
          <p className="text-pawlings-lime font-display font-bold mt-2">
            {pawling.personality ?? "Curious"} · Stage {pawling.growthStage}
          </p>
        </div>

        <div className="space-y-5">
          <div className="flex items-center justify-between rounded-xl bg-black/20 px-4 py-3 border border-white/5">
            <span className="font-display font-bold text-pawlings-white">
              <span aria-hidden>🦴</span> {treats} Treats
            </span>
            <span className="text-xs text-pawlings-muted">Feed costs {feedCost} Treats</span>
          </div>

          <div className="space-y-4">
            <CareStatBar label="Hunger" emoji="🍖" value={pawling.hunger} />
            <CareStatBar label="Happiness" emoji="❤️" value={pawling.happiness} />
            <CareStatBar label="Bond" emoji="🐾" value={pawling.bond} />
            <GrowthProgress xp={growth.current} stage={growth.stage} target={growth.target} />
          </div>

          {actionMessage ? (
            <p className="text-sm text-pawlings-lime" role="status" aria-live="polite">
              {actionMessage}
            </p>
          ) : null}

          <div className="grid grid-cols-2 gap-3">
            <GameButton
              type="button"
              onClick={onFeed}
              loading={feedLoading}
              disabled={Boolean(feedMinutesLeft) || treats < feedCost}
              fullWidth
            >
              {feedMinutesLeft ? `Full · ${feedMinutesLeft}m` : "Feed"}
            </GameButton>
            <GameButton
              type="button"
              variant="secondary"
              onClick={onPlay}
              loading={playLoading}
              disabled={Boolean(playMinutesLeft)}
              fullWidth
            >
              {playMinutesLeft ? `${playMinutesLeft}m` : "Play"}
            </GameButton>
          </div>
        </div>
      </div>
    </section>
  );
}
