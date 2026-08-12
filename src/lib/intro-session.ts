import { INTRO_SESSION_KEY } from "@/config/intro-motion";

export function hasIntroBeenSeen(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(INTRO_SESSION_KEY) === "true";
  } catch {
    return false;
  }
}

export function markIntroSeen(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(INTRO_SESSION_KEY, "true");
  } catch {
    // ignore storage failures
  }
}

export function clearIntroSeen(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(INTRO_SESSION_KEY);
  } catch {
    // ignore
  }
}

export function shouldShowIntro(
  seen: boolean,
  reducedMotion: boolean
): boolean {
  return !seen && !reducedMotion;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
