import { projectConfig } from "@/config/project";

/** Future-ready X share templates for adoption certificates */

export function buildAdoptionShareUrl(options: {
  referenceCode: string;
  siteUrl?: string;
  xUrl?: string;
}) {
  const { referenceCode, siteUrl = "https://pawlings.xyz", xUrl = projectConfig.xUrl } = options;
  const xHandle = xUrl.replace(/^https?:\/\/(?:www\.)?(?:x|twitter)\.com\//i, "@");
  const text = [
    "I just signed my official Pawlings adoption papers! 🐾",
    "",
    `Adoption ID: ${referenceCode}`,
    "",
    "A colourful personality is waiting for their forever home.",
    "",
    siteUrl,
    "",
    `Follow ${xHandle} for adoption updates.`,
    "",
    "#Pawlings #Adoption",
  ].join("\n");

  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
}

export function openAdoptionShare(options: {
  referenceCode: string;
  siteUrl?: string;
}) {
  if (typeof window === "undefined") return;
  window.open(buildAdoptionShareUrl(options), "_blank", "noopener,noreferrer");
}
