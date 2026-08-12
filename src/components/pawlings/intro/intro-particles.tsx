"use client";

import { motion } from "framer-motion";
import { introMotion } from "@/config/intro-motion";

const PARTICLES = [
  { x: "12%", y: "18%", size: 8, color: "#a8ef24", delay: 0 },
  { x: "84%", y: "22%", size: 6, color: "#f448b8", delay: 0.1 },
  { x: "78%", y: "72%", size: 10, color: "#667eea", delay: 0.15 },
  { x: "18%", y: "68%", size: 7, color: "#ffc928", delay: 0.05 },
  { x: "50%", y: "12%", size: 5, color: "#a64de8", delay: 0.2 },
  { x: "6%", y: "44%", size: 6, color: "#ff9418", delay: 0.12 },
  { x: "92%", y: "48%", size: 8, color: "#a8ef24", delay: 0.08 },
] as const;

interface IntroParticlesProps {
  visible: boolean;
  dispersing?: boolean;
}

export function IntroParticles({ visible, dispersing }: IntroParticlesProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {PARTICLES.map((p, i) => (
        <motion.span
          key={i}
          className="absolute block rotate-45"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: visible && !dispersing ? 0.55 : 0,
            scale: dispersing ? 1.8 : 1,
            x: dispersing ? (i % 2 === 0 ? -24 : 24) : 0,
            y: dispersing ? (i % 2 === 0 ? -18 : 18) : 0,
          }}
          transition={{
            duration: dispersing ? introMotion.exitContent : introMotion.bgEnter,
            delay: p.delay,
          }}
        />
      ))}

      {/* Paw silhouettes */}
      <svg
        className="absolute left-[8%] bottom-[14%] h-16 w-16 opacity-[0.06]"
        viewBox="0 0 64 64"
        fill="#a8ef24"
        aria-hidden
      >
        <ellipse cx="32" cy="40" rx="18" ry="14" />
        <circle cx="20" cy="22" r="6" />
        <circle cx="32" cy="16" r="6" />
        <circle cx="44" cy="22" r="6" />
      </svg>
      <svg
        className="absolute right-[10%] top-[16%] h-14 w-14 opacity-[0.05]"
        viewBox="0 0 64 64"
        fill="#f448b8"
        aria-hidden
      >
        <ellipse cx="32" cy="40" rx="18" ry="14" />
        <circle cx="20" cy="22" r="6" />
        <circle cx="32" cy="16" r="6" />
        <circle cx="44" cy="22" r="6" />
      </svg>
    </div>
  );
}
