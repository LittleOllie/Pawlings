"use client";

import { useState } from "react";
import Image from "next/image";
import { projectConfig } from "@/config/project";

const ARTWORKS = [
  projectConfig.assets.hero,
  projectConfig.assets.collection[0],
] as const;

interface WlArtPanelProps {
  headline: string;
  subheadline: string;
}

export function WlArtPanel({ headline, subheadline }: WlArtPanelProps) {
  const [primaryIndex, setPrimaryIndex] = useState(0);
  const secondaryIndex = primaryIndex === 0 ? 1 : 0;

  function swapArtwork() {
    setPrimaryIndex(secondaryIndex);
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="space-y-3 text-center lg:text-left">
        <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-balance text-pawlings">
          {headline}
        </h1>
        <p className="text-foreground-muted text-base sm:text-lg leading-relaxed max-w-md mx-auto lg:mx-0">
          {subheadline}
        </p>
      </div>

      <div className="relative mx-auto lg:mx-0 max-w-sm lg:max-w-none">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-art glow-accent ring-1 ring-accent/20">
          <Image
            key={ARTWORKS[primaryIndex]}
            src={ARTWORKS[primaryIndex]}
            alt="Pawlings artwork"
            fill
            className="object-contain p-4 sm:p-6 transition-opacity duration-300"
            priority
          />
        </div>

        <button
          type="button"
          onClick={swapArtwork}
          className="absolute -bottom-3 -right-2 sm:-bottom-4 sm:-right-4 w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-art ring-2 ring-brand-purple/50 shadow-lg rotate-6 hover:rotate-0 hover:ring-highlight/70 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-label="Swap to alternate artwork"
          title="Tap to swap"
        >
          <Image
            key={ARTWORKS[secondaryIndex]}
            src={ARTWORKS[secondaryIndex]}
            alt=""
            fill
            className="object-contain p-1.5 pointer-events-none"
            aria-hidden
          />
        </button>
      </div>
    </div>
  );
}
