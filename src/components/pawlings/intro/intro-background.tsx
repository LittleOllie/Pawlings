"use client";

import { motion } from "framer-motion";
import { introEasing, introMotion } from "@/config/intro-motion";

interface IntroBackgroundProps {
  active: boolean;
  exiting?: boolean;
}

export function IntroBackground({ active, exiting }: IntroBackgroundProps) {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute inset-0 bg-[#050a24]"
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: introMotion.bgEnter, ease: introEasing }}
      />

      <motion.div
        className="absolute inset-0 opacity-80"
        initial={{ opacity: 0 }}
        animate={{ opacity: active && !exiting ? 0.85 : 0 }}
        transition={{ duration: introMotion.bgEnter, ease: introEasing }}
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 42%, rgba(35,53,135,0.75) 0%, transparent 68%)",
        }}
      />

      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: active && !exiting ? 0.6 : 0 }}
        transition={{ duration: introMotion.bgEnter, delay: 0.08, ease: introEasing }}
        style={{
          background:
            "radial-gradient(circle at 30% 35%, rgba(168,239,36,0.14) 0%, transparent 42%), radial-gradient(circle at 72% 58%, rgba(166,77,232,0.16) 0%, transparent 40%)",
        }}
      />

      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: active && !exiting ? 1 : 0.3 }}
        transition={{ duration: introMotion.exitContent }}
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 42%, rgba(2,5,28,0.72) 100%)",
        }}
      />

      {/* Spotlight */}
      <motion.div
        className="absolute left-1/2 top-[38%] h-[min(70vw,520px)] w-[min(90vw,680px)] -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{
          opacity: active && !exiting ? 0.55 : 0,
          scale: exiting ? 1.15 : 1,
        }}
        transition={{ duration: introMotion.bgEnter, ease: introEasing }}
        style={{
          background:
            "radial-gradient(ellipse, rgba(255,201,40,0.12) 0%, rgba(168,239,36,0.08) 35%, transparent 70%)",
        }}
      />

      {/* Low-poly accents */}
      <svg
        className="absolute inset-0 h-full w-full opacity-30"
        viewBox="0 0 400 800"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <polygon
          points="40,120 90,80 130,140"
          fill="rgba(102,126,234,0.25)"
        />
        <polygon
          points="320,200 360,160 380,230"
          fill="rgba(168,239,36,0.15)"
        />
        <polygon
          points="300,620 350,580 370,660"
          fill="rgba(244,72,184,0.12)"
        />
      </svg>
    </div>
  );
}
