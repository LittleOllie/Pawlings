"use client";

import { motion } from "framer-motion";
import { introCopy, introEasing, introMotion } from "@/config/intro-motion";
import { GameButton } from "../game-button";
import { cn } from "@/lib/utils";

interface IntroCtaProps {
  visible: boolean;
  onJoin: () => void;
  disabled?: boolean;
}

export function IntroCta({ visible, onJoin, disabled }: IntroCtaProps) {
  return (
    <motion.div
      className="pointer-events-auto flex w-full flex-col items-center gap-2.5 sm:gap-3.5 text-center px-2 sm:px-4 max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 16 }}
      transition={{
        duration: introMotion.contentEnter,
        delay: visible ? introMotion.contentDelay : 0,
        ease: introEasing,
      }}
    >
      <p
        className={cn(
          "text-pawlings-muted leading-snug sm:leading-relaxed text-center text-balance",
          "text-xs sm:text-sm"
        )}
      >
      <span className="block">{introCopy.line1}</span>
      <span className="block">{introCopy.line2}</span>
      </p>
      <GameButton
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) onJoin();
        }}
        disabled={disabled}
        className="relative z-[109] min-w-[200px] sm:min-w-[220px] text-sm sm:text-base !py-3 sm:!py-3.5 !px-6 sm:!px-8"
      >
        {introCopy.cta}
      </GameButton>
      <p className="text-[10px] sm:text-xs text-pawlings-muted/80">{introCopy.footnote}</p>
    </motion.div>
  );
}
