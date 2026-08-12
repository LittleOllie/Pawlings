"use client";

import { useState } from "react";
import { PawlingsHeader } from "@/components/pawlings/pawlings-header";
import { PawlingsFooter } from "@/components/pawlings/pawlings-footer";
import { WorldBackground } from "@/components/pawlings/world-background";
import { PawlingCard } from "@/components/pawlings/dashboard/pawling-card";
import { StatusCard } from "@/components/pawlings/dashboard/status-card";
import { CareButton } from "@/components/pawlings/dashboard/care-button";
import { WalletPanel } from "@/components/pawlings/dashboard/wallet-panel";
import { EvolutionProgress } from "@/components/pawlings/dashboard/evolution-progress";
import { NotificationCard } from "@/components/pawlings/dashboard/notification-card";
import { Timeline } from "@/components/pawlings/dashboard/timeline";
import { GameButton } from "@/components/pawlings/game-button";
import { useAdoptionOverlay } from "@/components/pawlings/adoption-overlay-context";
import {
  DEMO_NOTIFICATIONS,
  DEMO_PAWLING,
  DEMO_TIMELINE,
} from "@/lib/pawling-placeholders";
import { pawlingsContent } from "@/config/pawlings-content";

interface DashboardClientProps {
  xUrl?: string;
}

export function DashboardClient({ xUrl }: DashboardClientProps) {
  const { openAdoption } = useAdoptionOverlay();
  const [connected, setConnected] = useState(false);
  const [demoAddress] = useState("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045");
  const dashboard = pawlingsContent.dashboard;

  return (
    <div className="pawlings-page relative min-h-screen overflow-x-hidden">
      <WorldBackground />
      <PawlingsHeader xUrl={xUrl} subpage />

      <main className="relative z-10 pt-28 pb-16 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl space-y-8">
          <header className="space-y-3">
            <p className="section-eyebrow">{dashboard.eyebrow}</p>
            <h1
              className="font-display font-bold text-pawlings-white"
              style={{ fontSize: "var(--text-display-lg)" }}
            >
              {dashboard.heading}
            </h1>
            <p className="text-pawlings-muted max-w-2xl leading-relaxed">{dashboard.body}</p>
          </header>

          <WalletPanel
            connected={connected}
            address={connected ? demoAddress : null}
            onConnect={() => setConnected(true)}
            onDisconnect={() => setConnected(false)}
          />

          {!connected ? (
            <section className="dashboard-empty dashboard-glass rounded-[var(--radius-panel)] px-6 py-16 sm:py-20 text-center">
              <div className="mx-auto mb-6 text-6xl opacity-80 animate-logo-float" aria-hidden>
                💤
              </div>
              <h2 className="font-display text-2xl font-bold text-pawlings-white mb-3">
                {dashboard.empty.title}
              </h2>
              <p className="text-pawlings-muted max-w-md mx-auto mb-8 leading-relaxed">
                {dashboard.empty.body}
              </p>
              <GameButton type="button" onClick={openAdoption}>
                {dashboard.empty.cta}
              </GameButton>
            </section>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-6">
                <PawlingCard pawling={DEMO_PAWLING} />
                <EvolutionProgress currentStage={DEMO_PAWLING.stage} />
                <CareButton label={dashboard.feedLabel} />
              </div>
              <div className="space-y-6">
                <div className="dashboard-glass rounded-[var(--radius-panel)] p-5 sm:p-6">
                  <h2 className="font-display text-lg font-bold text-pawlings-white mb-4">
                    {dashboard.statusHeading}
                  </h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <StatusCard label="Happiness" value={DEMO_PAWLING.stats.happiness} />
                    <StatusCard label="Energy" value={DEMO_PAWLING.stats.energy} />
                    <StatusCard label="Hunger" value={DEMO_PAWLING.stats.hunger} />
                    <StatusCard label="Growth" value={DEMO_PAWLING.stats.growth} />
                  </div>
                </div>
                <div className="dashboard-glass rounded-[var(--radius-panel)] p-5 sm:p-6 space-y-3">
                  <h2 className="font-display text-lg font-bold text-pawlings-white mb-2">
                    {dashboard.notificationsHeading}
                  </h2>
                  {DEMO_NOTIFICATIONS.map((n) => (
                    <NotificationCard key={n.id} notification={n} />
                  ))}
                </div>
                <div className="dashboard-glass rounded-[var(--radius-panel)] p-5 sm:p-6">
                  <h2 className="font-display text-lg font-bold text-pawlings-white mb-4">
                    {dashboard.timelineHeading}
                  </h2>
                  <Timeline events={DEMO_TIMELINE} />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <PawlingsFooter xUrl={xUrl} />
    </div>
  );
}
