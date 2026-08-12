/**
 * Project identity — Pawlings collection
 */

export const projectConfig = {
  name: "Pawlings",
  shortName: "Pawlings",
  tagline: "Join the pack.",
  description:
    "Pawlings: a Web3 collection. Join the whitelist and claim your spot in the pack.",
  applicationLabel: "Join the Whitelist",
  applicantLabel: "Applicant",
  approvedLabel: "Approved",
  waitlistLabel: "Waitlisted",
  rejectedLabel: "Not Selected",
  supportEmail: "hello@example.com",
  xUrl: "https://x.com/Pawlings_",
  discordUrl: "",
  websiteUrl: "",
  primaryCta: "Join Whitelist",
  splashCta: "Join the Pack!",
  secondaryCta: "Learn More",
  assets: {
    logo: "/branding/PLLogo.png",
    splashDog: "/branding/Dog2Transparent.png",
    hero: "/branding/hero.png",
    collection: [
      "/branding/collection-01.png",
      "/branding/collection-02.png",
    ],
  },
  isPlaceholderBranding: false,
  whitelistPage: {
    eyebrow: "Whitelist open",
    headline: "Join the Whitelist",
    subheadline:
      "The Pawlings pack is forming. Drop your wallet. Halos optional, spots limited.",
    formIntro: "One wallet. Optional X & Discord. No connect, no signature.",
    disclaimer:
      "Submitting does not guarantee a spot. Every wallet is reviewed.",
    closedTitle: "Whitelist closed",
    successTitle: "Wallet received",
    successBody:
      "You're in the queue. Save your reference and follow Pawlings on X for updates.",
  },
} as const;

export type ProjectConfig = typeof projectConfig;
