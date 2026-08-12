"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { pawlingsContent } from "@/config/pawlings-content";
import { GameButton } from "./game-button";
import { downloadAdoptionCertificate } from "@/lib/certificate";
import { openAdoptionShare } from "@/lib/share-x";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/intro-session";
import { playPawlingsSound } from "@/lib/pawlings-sound";

const CONFETTI_PIECES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${8 + (i * 5) % 84}%`,
  delay: `${(i * 0.04).toFixed(2)}s`,
  color: ["#a8ef24", "#ffc928", "#f448b8", "#a64de8", "#ff9418"][i % 5],
}));

const INK_PARTICLES = [
  { x: "-18px", y: "-14px", delay: "0.58s" },
  { x: "14px", y: "-16px", delay: "0.62s" },
  { x: "-10px", y: "12px", delay: "0.6s" },
  { x: "20px", y: "8px", delay: "0.64s" },
];

export interface AdoptionSuccessData {
  referenceCode: string;
  walletAddress: string;
  xHandle?: string;
  signatureDataUrl: string;
  submittedAt: Date;
}

interface AdoptionSuccessScreenProps {
  data: AdoptionSuccessData;
  onReturnHome: () => void;
}

function shortenWallet(address: string) {
  if (address.length < 12) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function AdoptionSuccessScreen({ data, onReturnHome }: AdoptionSuccessScreenProps) {
  const copy = pawlingsContent.adoption;
  const [showStamp, setShowStamp] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    if (reduced) {
      setShowStamp(true);
      setShowContent(true);
      return;
    }
    const stampTimer = window.setTimeout(() => {
      setShowStamp(true);
      playPawlingsSound("success_bark");
    }, 80);
    const copyTimer = window.setTimeout(() => setShowContent(true), 1100);
    return () => {
      window.clearTimeout(stampTimer);
      window.clearTimeout(copyTimer);
    };
  }, []);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadAdoptionCertificate({
        referenceCode: data.referenceCode,
        walletAddress: data.walletAddress,
        xHandle: data.xHandle,
        signatureDataUrl: data.signatureDataUrl,
        submittedAt: data.submittedAt,
        statusLabel: copy.certificateStatus,
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      className={cn(
        "relative text-center py-4 min-h-[320px] flex flex-col items-center overflow-hidden",
        showStamp && "animate-adoption-paper-shake animate-adoption-paper-fold"
      )}
      aria-live="polite"
    >
      {showStamp && (
        <div className="adoption-confetti pointer-events-none absolute inset-0" aria-hidden>
          {CONFETTI_PIECES.map((piece) => (
            <span
              key={piece.id}
              className="adoption-confetti-piece"
              style={{
                left: piece.left,
                backgroundColor: piece.color,
                animationDelay: piece.delay,
              }}
            />
          ))}
        </div>
      )}

      {showStamp && (
        <div className="relative mb-5">
          {INK_PARTICLES.map((p, i) => (
            <span
              key={i}
              className="adoption-ink-particle"
              style={
                {
                  top: "50%",
                  left: "50%",
                  "--ink-x": p.x,
                  "--ink-y": p.y,
                  animationDelay: p.delay,
                } as React.CSSProperties
              }
              aria-hidden
            />
          ))}
          <div className="animate-adoption-stamp-slam">
            <span className="adoption-stamp-mark adoption-stamp-mark--large">
              {copy.stampText}
            </span>
          </div>
        </div>
      )}

      {showContent && (
        <div className="space-y-4 adoption-success-reveal w-full max-w-md mx-auto">
          <span className="adoption-status-pill">{copy.successBadge}</span>
          <h3 className="font-display text-2xl font-bold text-paper-text">
            {copy.successTitle}
          </h3>
          <p className="text-sm text-paper-text-muted leading-relaxed">
            {copy.successBody}
          </p>

          <div className="adoption-certificate-preview mx-auto">
            <div className="adoption-certificate-preview-inner">
              <Image
                src={pawlingsContent.brand.logoPath}
                alt=""
                width={120}
                height={40}
                className="h-10 w-auto mx-auto mb-3"
              />
              <p className="text-[10px] uppercase tracking-widest text-paper-text-muted mb-1">
                Official Adoption Certificate
              </p>
              <p className="font-display font-bold text-paper-text text-sm mb-3">
                {copy.certificateHeading}
              </p>
              <dl className="text-left text-xs space-y-1.5">
                <div className="flex justify-between gap-3">
                  <dt className="text-paper-text-muted">ID</dt>
                  <dd className="font-mono font-semibold text-pawlings-purple">
                    {data.referenceCode}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-paper-text-muted">Wallet</dt>
                  <dd className="font-mono">{shortenWallet(data.walletAddress)}</dd>
                </div>
                {data.xHandle && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-paper-text-muted">X</dt>
                    <dd>{data.xHandle.startsWith("@") ? data.xHandle : `@${data.xHandle}`}</dd>
                  </div>
                )}
              </dl>
              {data.signatureDataUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={data.signatureDataUrl}
                  alt="Your signature"
                  className="mt-3 h-12 w-auto mx-auto opacity-90"
                />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            <GameButton
              type="button"
              onClick={() => void handleDownload()}
              loading={downloading}
              fullWidth
            >
              {copy.downloadCertificate}
            </GameButton>
            <GameButton
              type="button"
              variant="secondary"
              fullWidth
              className="!text-paper-text !border-paper-border"
              onClick={() =>
                openAdoptionShare({ referenceCode: data.referenceCode })
              }
            >
              {copy.shareOnX}
            </GameButton>
            <GameButton
              type="button"
              variant="ghost"
              fullWidth
              className="!text-paper-text-muted"
              onClick={onReturnHome}
            >
              {copy.returnHome}
            </GameButton>
          </div>
        </div>
      )}
    </div>
  );
}
