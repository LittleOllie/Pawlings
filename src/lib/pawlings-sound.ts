/**
 * Sound hooks — architecture only. Wire real audio assets when ready.
 * Respects reduced motion / user mute preference.
 */

export type PawlingsSoundId =
  | "hover_bark"
  | "paw_steps"
  | "success_bark"
  | "feed"
  | "evolution";

const SOUND_PATHS: Record<PawlingsSoundId, string> = {
  hover_bark: "/sounds/hover-bark.mp3",
  paw_steps: "/sounds/paw-steps.mp3",
  success_bark: "/sounds/success-bark.mp3",
  feed: "/sounds/feed.mp3",
  evolution: "/sounds/evolution.mp3",
};

let muted = false;

export function setPawlingsSoundMuted(value: boolean) {
  muted = value;
}

export function isPawlingsSoundMuted() {
  return muted;
}

/** Play a sound if enabled and assets exist. Never throws. */
export function playPawlingsSound(id: PawlingsSoundId, volume = 0.4) {
  if (typeof window === "undefined") return;
  if (muted) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  try {
    const audio = new Audio(SOUND_PATHS[id]);
    audio.volume = volume;
    void audio.play().catch(() => {
      /* assets not shipped yet */
    });
  } catch {
    /* ignore */
  }
}
