import type { CSSProperties } from "react";
import { pawlingsContent } from "@/config/pawlings-content";

/** Floating paw decor — position, size, opacity, drift timing */
const PAW_DECOR = [
  { id: 1, top: "6%", left: "4%", w: 120, opacity: 0.22, rotate: -18, delay: 0, duration: 22 },
  { id: 2, top: "18%", left: "84%", w: 96, opacity: 0.18, rotate: 12, delay: -4, duration: 26 },
  { id: 3, top: "36%", left: "10%", w: 140, opacity: 0.2, rotate: 8, delay: -8, duration: 24 },
  { id: 4, top: "50%", left: "86%", w: 128, opacity: 0.24, rotate: -10, delay: -2, duration: 28 },
  { id: 5, top: "66%", left: "2%", w: 104, opacity: 0.18, rotate: 15, delay: -6, duration: 23 },
  { id: 6, top: "76%", left: "70%", w: 152, opacity: 0.16, rotate: -6, delay: -10, duration: 25 },
  { id: 7, top: "12%", left: "46%", w: 88, opacity: 0.14, rotate: 20, delay: -12, duration: 30 },
  { id: 8, top: "86%", left: "34%", w: 100, opacity: 0.2, rotate: -14, delay: -5, duration: 21 },
  { id: 9, top: "42%", left: "56%", w: 80, opacity: 0.15, rotate: 6, delay: -14, duration: 27 },
  { id: 10, top: "28%", left: "24%", w: 96, opacity: 0.17, rotate: -22, delay: -7, duration: 29 },
] as const;

/** Layered ambient background — sky, glow, floating pawBG decor */
export function WorldBackground() {
  return (
    <div
      className="world-bg pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div className="world-bg-sky" />
      <div className="world-bg-glow world-bg-glow--lime" />
      <div className="world-bg-glow world-bg-glow--pink" />
      <div className="world-bg-glow world-bg-glow--purple" />
      <div className="world-bg-cloud world-bg-cloud--1" />
      <div className="world-bg-cloud world-bg-cloud--2" />
      <div className="world-bg-cloud world-bg-cloud--3" />
      <div className="world-bg-mountains" />

      <div className="world-bg-paws">
        {PAW_DECOR.map((paw) => (
          <div
            key={paw.id}
            className="world-bg-paw"
            style={
              {
                top: paw.top,
                left: paw.left,
                width: paw.w,
                height: paw.w,
                opacity: paw.opacity,
                ["--paw-rotate" as string]: `${paw.rotate}deg`,
                ["--paw-drift-duration" as string]: `${paw.duration}s`,
                animationDelay: `${paw.delay}s`,
              } as CSSProperties
            }
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={pawlingsContent.assets.pawBg}
              alt=""
              className="world-bg-paw-img"
              width={paw.w}
              height={paw.w}
              draggable={false}
              loading="lazy"
              decoding="async"
            />
          </div>
        ))}
      </div>

      <div className="world-bg-particles">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className={`world-bg-star world-bg-star--${i + 1}`} />
        ))}
      </div>
    </div>
  );
}
