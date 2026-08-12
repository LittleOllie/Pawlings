"use client";

import Image from "next/image";
import { GameButton } from "@/components/pawlings/game-button";
import type { Pawling } from "@/types/dashboard";

interface SharePawlingModalProps {
  pawling: Pawling;
  open: boolean;
  onClose: () => void;
}

export function SharePawlingModal({ pawling, open, onClose }: SharePawlingModalProps) {
  if (!open) return null;

  const message = encodeURIComponent(
    `Meet ${pawling.name} 🐾\nMy Pawling is officially part of the Pack.\n#Pawlings`
  );
  const shareUrl = `https://twitter.com/intent/tweet?text=${message}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-pawling-title"
      onClick={onClose}
    >
      <div
        className="dashboard-glass w-full max-w-md rounded-[var(--radius-panel)] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="share-pawling-title" className="font-display text-xl font-bold text-pawlings-white mb-4">
          Share My Pawling
        </h2>
        <div className="flex gap-4 items-center mb-6">
          <Image src={pawling.image} alt="" width={96} height={96} className="object-contain" />
          <div>
            <p className="font-display font-bold text-pawlings-white">{pawling.name}</p>
            <p className="text-sm text-pawlings-muted">#{pawling.tokenId}</p>
          </div>
        </div>
        <div className="space-y-3">
          <GameButton type="button" fullWidth onClick={() => window.open(shareUrl, "_blank", "noopener,noreferrer")}>
            Share on X
          </GameButton>
          <GameButton type="button" variant="secondary" fullWidth disabled title="Coming soon">
            Download Image
          </GameButton>
          <p className="text-xs text-pawlings-muted text-center">
            TODO: Generated share-card download will be added in a follow-up pass.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="w-full text-sm text-pawlings-muted hover:text-pawlings-white min-h-[44px]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
