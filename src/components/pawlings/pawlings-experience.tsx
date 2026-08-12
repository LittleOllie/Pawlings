"use client";

import { useEffect, useRef, useState } from "react";
import { LayoutGroup } from "framer-motion";
import { PawlingsLanding } from "./pawlings-landing";
import {
  PawlingsIntroOverlay,
  useIntroState,
} from "./intro/pawlings-intro";
import { PawlingsSharedLogo } from "./intro/pawlings-shared-logo";
import {
  AdoptionOverlayProvider,
  useAdoptionOverlay,
} from "./adoption-overlay-context";
import { cn } from "@/lib/utils";

interface PawlingsExperienceProps {
  canSubmit: boolean;
  closedMessage: string;
  xUrl?: string;
  discordUrl?: string;
}

function PawlingsExperienceInner(props: PawlingsExperienceProps) {
  const focusRef = useRef<HTMLHeadingElement>(null);
  const { openAdoption, isOpen: adoptionOpen } = useAdoptionOverlay();
  const [pendingAdoptionOpen, setPendingAdoptionOpen] = useState(false);

  const {
    introState,
    introComplete,
    logoInIntro,
    logoInHero,
    showSkip,
    handleJoin,
    handleSkip,
  } = useIntroState({
    onComplete: () => {
      window.scrollTo(0, 0);
      requestAnimationFrame(() => {
        focusRef.current?.focus({ preventScroll: true });
      });
    },
  });

  const showLanding =
    introState === "transitioning" || introState === "complete";

  const handleIntroJoin = () => {
    setPendingAdoptionOpen(true);
    handleJoin();
  };

  useEffect(() => {
    if (introComplete && pendingAdoptionOpen) {
      setPendingAdoptionOpen(false);
      const timer = window.setTimeout(() => openAdoption(), 450);
      return () => window.clearTimeout(timer);
    }
  }, [introComplete, pendingAdoptionOpen, openAdoption]);

  return (
    <LayoutGroup id="pawlings-intro">
      <div
        className={cn(
          !introComplete && "pointer-events-none select-none",
          adoptionOpen && "pointer-events-none"
        )}
        {...(!introComplete || adoptionOpen ? { inert: true as boolean } : {})}
        aria-hidden={!introComplete || adoptionOpen}
      >
        <PawlingsLanding
          {...props}
          introComplete={introComplete}
          isTransitioning={introState === "transitioning"}
          logoInHero={logoInHero}
          heroFocusRef={focusRef}
          showChrome={showLanding}
        />
      </div>

      {!introComplete && (
        <PawlingsIntroOverlay
          introState={introState}
          showSkip={showSkip}
          onJoin={handleIntroJoin}
          onSkip={handleSkip}
          logoSlot={
            logoInIntro ? (
              <PawlingsSharedLogo
                variant="intro"
                layout
                priority
                sceneHalo
                showGlint={introState === "ready"}
                animateEnter={introState === "entering"}
              />
            ) : null
          }
        />
      )}
    </LayoutGroup>
  );
}

export function PawlingsExperience(props: PawlingsExperienceProps) {
  return (
    <AdoptionOverlayProvider
      canSubmit={props.canSubmit}
      closedMessage={props.closedMessage}
    >
      <PawlingsExperienceInner {...props} />
    </AdoptionOverlayProvider>
  );
}
