"use client";

import { useEffect, useState } from "react";
import { AdoptionOverlayProvider } from "@/components/pawlings/adoption-overlay-context";
import { DashboardClient } from "./dashboard-client";
import {
  DashboardComingSoon,
  DashboardPreviewLogin,
} from "./dashboard-gates";

interface DashboardExperienceProps {
  canSubmit: boolean;
  closedMessage: string;
  xUrl?: string;
  accessMode: "live" | "preview" | "locked";
  previewConfigured: boolean;
}

export function DashboardExperience({
  canSubmit,
  closedMessage,
  xUrl,
  accessMode: initialMode,
  previewConfigured,
}: DashboardExperienceProps) {
  const [accessMode, setAccessMode] = useState(initialMode);

  useEffect(() => {
    setAccessMode(initialMode);
  }, [initialMode]);

  if (accessMode === "locked") {
    if (previewConfigured) {
      return (
        <DashboardPreviewLogin
          onSuccess={() => {
            setAccessMode("preview");
          }}
        />
      );
    }
    return <DashboardComingSoon />;
  }

  return (
    <AdoptionOverlayProvider canSubmit={canSubmit} closedMessage={closedMessage}>
      <DashboardClient xUrl={xUrl} accessMode={accessMode} />
    </AdoptionOverlayProvider>
  );
}
