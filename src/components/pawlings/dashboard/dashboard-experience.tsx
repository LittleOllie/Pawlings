"use client";

import { AdoptionOverlayProvider } from "@/components/pawlings/adoption-overlay-context";
import { DashboardClient } from "./dashboard-client";

interface DashboardExperienceProps {
  canSubmit: boolean;
  closedMessage: string;
  xUrl?: string;
}

export function DashboardExperience({
  canSubmit,
  closedMessage,
  xUrl,
}: DashboardExperienceProps) {
  return (
    <AdoptionOverlayProvider canSubmit={canSubmit} closedMessage={closedMessage}>
      <DashboardClient xUrl={xUrl} />
    </AdoptionOverlayProvider>
  );
}
