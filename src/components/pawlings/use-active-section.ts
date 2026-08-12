"use client";

import { useEffect, useState } from "react";
import { pawlingsContent } from "@/config/pawlings-content";

export const NAV_SECTION_IDS = [
  "home",
  "meet-the-pack",
  "roadmap",
  "faq",
] as const;

export type NavSectionId = (typeof NAV_SECTION_IDS)[number];

export const NAV_LINKS = [
  { type: "section" as const, id: "home", label: pawlingsContent.nav.home },
  {
    type: "section" as const,
    id: "meet-the-pack",
    label: pawlingsContent.nav.meetThePack,
  },
  { type: "section" as const, id: "roadmap", label: pawlingsContent.nav.roadmap },
  {
    type: "route" as const,
    href: "/collaborate",
    label: pawlingsContent.nav.collabs,
  },
  { type: "section" as const, id: "faq", label: pawlingsContent.nav.faq },
];

export function useActiveSection(enabled = true) {
  const [active, setActive] = useState<NavSectionId>("home");

  useEffect(() => {
    if (!enabled) return;

    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.intersectionRatio);
        }

        let bestId: NavSectionId = "home";
        let bestRatio = 0;

        for (const id of NAV_SECTION_IDS) {
          const ratio = ratios.get(id) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }

        if (bestRatio > 0) {
          setActive(bestId);
        }
      },
      {
        rootMargin: "-18% 0px -52% 0px",
        threshold: [0, 0.15, 0.35, 0.55, 0.75],
      }
    );

    for (const id of NAV_SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [enabled]);

  return active;
}
