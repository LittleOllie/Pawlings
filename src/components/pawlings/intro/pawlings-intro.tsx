"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  introCopy,
  introMotion,
  type IntroState,
} from "@/config/intro-motion";
import {
  hasIntroBeenSeen,
  markIntroSeen,
  prefersReducedMotion,
  shouldShowIntro,
} from "@/lib/intro-session";
import { IntroBackground } from "./intro-background";
import { IntroParticles } from "./intro-particles";
import { IntroCta } from "./intro-cta";
import { cn } from "@/lib/utils";

interface UseIntroStateOptions {
  onComplete?: () => void;
}

export function useIntroState({ onComplete }: UseIntroStateOptions = {}) {
  const [introState, setIntroState] = useState<IntroState>("pending");
  const [showSkip, setShowSkip] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const transitioningRef = useRef(false);

  const introComplete = introState === "complete";
  const isIntroActive = !introComplete && introState !== "pending";
  const isTransitioning = introState === "transitioning";

  /** Intro logo visible until hero logo takes over in the same frame */
  const logoInIntro =
    introState === "entering" || introState === "ready";
  const logoInHero =
    introState === "transitioning" || introState === "complete";

  useEffect(() => {
    const seen = hasIntroBeenSeen();
    const reduced = prefersReducedMotion();
    setReducedMotion(reduced);

    if (!shouldShowIntro(seen, reduced)) {
      setIntroState("complete");
      return;
    }

    setIntroState("entering");
    const readyTimer = window.setTimeout(
      () => setIntroState("ready"),
      introMotion.logoEnter * 1000 + 200
    );
    const skipTimer = window.setTimeout(
      () => setShowSkip(true),
      introMotion.skipDelayMs
    );

    return () => {
      window.clearTimeout(readyTimer);
      window.clearTimeout(skipTimer);
    };
  }, []);

  useEffect(() => {
    if (!isIntroActive) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isIntroActive]);

  const finishIntro = useCallback(
    (instant = false) => {
      if (transitioningRef.current) return;
      transitioningRef.current = true;
      markIntroSeen();

      if (instant || reducedMotion) {
        setIntroState("complete");
        transitioningRef.current = false;
        onComplete?.();
        return;
      }

      setIntroState("transitioning");
      window.setTimeout(() => {
        setIntroState("complete");
        transitioningRef.current = false;
        onComplete?.();
      }, introMotion.logoTransition * 1000 + 100);
    },
    [reducedMotion, onComplete]
  );

  const handleJoin = useCallback(() => {
    finishIntro(false);
  }, [finishIntro]);

  const handleSkip = useCallback(() => {
    finishIntro(true);
  }, [finishIntro]);

  useEffect(() => {
    if (!isIntroActive) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleSkip();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isIntroActive, handleSkip]);

  return {
    introState,
    introComplete,
    isIntroActive,
    isTransitioning,
    logoInIntro,
    logoInHero,
    showSkip,
    reducedMotion,
    handleJoin,
    handleSkip,
  };
}

interface PawlingsIntroOverlayProps {
  introState: IntroState;
  showSkip: boolean;
  onJoin: () => void;
  onSkip: () => void;
  /** Logo slot — keeps logo in the same flex position as on the intro screen */
  logoSlot?: React.ReactNode;
}

export function PawlingsIntroOverlay({
  introState,
  showSkip,
  onJoin,
  onSkip,
  logoSlot,
}: PawlingsIntroOverlayProps) {
  if (introState === "complete" || introState === "pending") return null;

  const exiting = introState === "transitioning";
  const contentVisible = introState === "ready";

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex flex-col pointer-events-auto overflow-x-hidden",
        "h-[100svh] max-h-[100svh]",
        exiting && "pointer-events-none"
      )}
      role="dialog"
      aria-modal={!exiting}
      aria-label={introCopy.srTitle}
      aria-hidden={exiting}
    >
      {/* Background fades during logo travel so the move is visible */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none transition-opacity duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          exiting ? "opacity-0" : "opacity-100"
        )}
      >
        <IntroBackground active exiting={false} />
        <IntroParticles visible dispersing={exiting} />
      </div>

      {showSkip && !exiting && (
        <button
          type="button"
          onClick={onSkip}
          className="absolute top-5 right-4 sm:right-6 z-[110] text-xs text-pawlings-muted/70 hover:text-pawlings-white underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-pawlings-lime rounded px-2 py-1"
        >
          {introCopy.skip}
        </button>
      )}

      <div className="intro-shell relative z-[105] flex h-full min-h-0 flex-1 flex-col px-3 sm:px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(3.5rem,env(safe-area-inset-top))] sm:pb-5 sm:pt-16">
        <h1 className="sr-only">{introCopy.srTitle}</h1>

        <div className="intro-stack mx-auto flex min-h-0 w-full max-w-lg flex-1 flex-col items-center justify-center gap-3 sm:gap-4">
          {/* Eyebrow */}
          <p
            className={cn(
              "intro-eyebrow shrink-0 text-center text-[10px] sm:text-xs md:text-sm font-display font-bold uppercase tracking-[0.2em] sm:tracking-[0.28em] text-pawlings-pink transition-all duration-300 px-2",
              contentVisible && !exiting
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2 pointer-events-none absolute w-0 h-0 overflow-hidden"
            )}
          >
            {introCopy.eyebrow}
          </p>

          {/* Logo — flex-shrinkable, never overlaps chrome above/below */}
          <div className="intro-logo-slot flex min-h-0 w-full flex-1 items-center justify-center">
            {logoSlot}
          </div>

          {/* CTA */}
          <div
            className={cn(
              "intro-cta-slot relative z-[108] w-full max-w-md shrink-0",
              contentVisible && !exiting ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
          >
            <IntroCta
              visible={contentVisible && !exiting}
              onJoin={onJoin}
              disabled={introState !== "ready"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
