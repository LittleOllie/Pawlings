"use client";

import { motion } from "framer-motion";
import { introEasing } from "@/config/intro-motion";

interface HeroAtmosphereProps {
  active?: boolean;
}

export function HeroAtmosphere({ active = true }: HeroAtmosphereProps) {
  if (!active) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      <motion.div
        className="hero-glow hero-glow--center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: introEasing }}
      />
      <motion.div
        className="hero-glow hero-glow--lime"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.2, ease: introEasing }}
      />
      <motion.div
        className="hero-glow hero-glow--pink"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.35, ease: introEasing }}
      />

      {[0, 1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`hero-sparkle hero-sparkle--${i + 1}`}
        />
      ))}

      <div className="hero-crown-sparkle" />
    </div>
  );
}
