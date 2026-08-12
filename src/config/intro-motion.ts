export const INTRO_SESSION_KEY = "pawlings-intro-seen";
export const PAWLINGS_LOGO_LAYOUT_ID = "pawlings-main-logo";

export type IntroState =
  | "pending"
  | "entering"
  | "ready"
  | "transitioning"
  | "complete";

export const introMotion = {
  bgEnter: 0.55,
  logoEnter: 0.85,
  glintDelay: 0.95,
  glintDuration: 0.5,
  contentEnter: 0.45,
  contentDelay: 1.05,
  exitContent: 0.3,
  logoTransition: 0.85,
  pageReveal: 0.5,
  skipFade: 0.2,
  skipDelayMs: 500,
} as const;

export const introEasing = [0.22, 1, 0.36, 1] as const;

export const introCopy = {
  eyebrow: "Welcome to the world of",
  line1: "Every Pawling begins as a curious puppy.",
  line2: "You're not minting. You're adopting a companion.",
  cta: "🐾 Begin Adoption",
  footnote: "Adoption applications are now open",
  skip: "Skip intro",
  srTitle: "Pawlings welcome",
} as const;
