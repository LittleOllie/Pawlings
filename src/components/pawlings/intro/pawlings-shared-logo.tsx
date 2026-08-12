"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { pawlingsContent } from "@/config/pawlings-content";
import {
  PAWLINGS_LOGO_LAYOUT_ID,
  introEasing,
  introMotion,
} from "@/config/intro-motion";
import { cn } from "@/lib/utils";

export type SharedLogoVariant = "intro" | "hero";

interface PawlingsSharedLogoProps {
  variant: SharedLogoVariant;
  layout?: boolean;
  priority?: boolean;
  className?: string;
  showGlint?: boolean;
  animateEnter?: boolean;
  disableFloat?: boolean;
  /** Hero scene provides its own halo — skip inner ambient layers */
  sceneHalo?: boolean;
}

/** Intro logo: sized by parent slot so it never overlaps eyebrow or CTA */
const layoutSizes: Record<SharedLogoVariant, string> = {
  intro:
    "h-auto w-auto max-h-full max-w-[min(92vw,820px)] sm:max-w-[min(90vw,880px)]",
  hero: "h-36 sm:h-48 md:h-56 lg:h-64 xl:h-72 w-auto max-w-[min(92vw,560px)]",
};

export function PawlingsSharedLogo({
  variant,
  layout = false,
  priority = false,
  className,
  showGlint = false,
  animateEnter = false,
  disableFloat = false,
  sceneHalo = false,
}: PawlingsSharedLogoProps) {
  const useInnerHalo = !sceneHalo;
  const image = (
    <Image
      src={pawlingsContent.brand.logoPath}
      alt={pawlingsContent.brand.logoAlt}
      width={512}
      height={512}
      priority={priority}
      className={cn(
        "relative z-10 h-full w-auto max-w-full object-contain object-center",
        variant === "intro" && "max-h-full",
        variant === "hero" && !disableFloat && "animate-logo-float"
      )}
    />
  );

  const inner = (
    <span className="logo-stage relative inline-flex items-center justify-center">
      {useInnerHalo && (
        <>
          <span
            className={cn(
              "logo-ambient-glow pointer-events-none",
              variant === "intro" ? "logo-ambient-glow--intro" : "logo-ambient-glow--hero"
            )}
            aria-hidden
          />
          <span
            className={cn(
              "logo-ambient-glow logo-ambient-glow--soft pointer-events-none",
              variant === "intro" ? "logo-ambient-glow--intro" : "logo-ambient-glow--hero"
            )}
            aria-hidden
          />
        </>
      )}
      {image}
      {showGlint && (
        <span
          className={cn(
            "logo-crown-glow pointer-events-none absolute left-[36%] top-[1%] z-20 h-[26%] w-[28%]",
            variant === "intro" ? "logo-crown-glow--intro" : "logo-crown-glow--hero"
          )}
          aria-hidden
        />
      )}
    </span>
  );

  if (!layout) {
    return (
      <span
        className={cn(
          "logo-wrap inline-flex overflow-visible",
          layoutSizes[variant],
          className
        )}
      >
        {inner}
      </span>
    );
  }

  return (
    <motion.div
      layoutId={PAWLINGS_LOGO_LAYOUT_ID}
      layout
      className={cn(
        "logo-wrap inline-flex shrink-0 items-center justify-center overflow-visible pointer-events-none",
        layoutSizes[variant],
        variant === "intro" && "max-h-[min(100%,calc(100svh-15rem))] sm:max-h-[min(100%,calc(100svh-16rem))]",
        sceneHalo && "logo-wrap--scene",
        className
      )}
      style={{ overflow: "visible" }}
      initial={
        animateEnter && variant === "intro"
          ? { opacity: 0, scale: 0.72, y: 24 }
          : false
      }
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        layout: {
          duration: introMotion.logoTransition,
          ease: introEasing,
        },
        opacity: { duration: introMotion.logoEnter, ease: introEasing },
        scale: { duration: introMotion.logoEnter, ease: introEasing },
        y: { duration: introMotion.logoEnter, ease: introEasing },
      }}
    >
      {inner}
    </motion.div>
  );
}
