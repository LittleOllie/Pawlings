"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PawlingsHeader } from "@/components/pawlings/pawlings-header";
import { PawlingsFooter } from "@/components/pawlings/pawlings-footer";
import { WorldBackground } from "@/components/pawlings/world-background";
import { GameButton } from "@/components/pawlings/game-button";
import { useAdoptionOverlay } from "@/components/pawlings/adoption-overlay-context";
import { useWalletConnection } from "@/hooks/use-wallet-connection";
import { canFeed, canPlay } from "@/lib/dashboard/care";
import { dashboardConfig } from "@/config/dashboard-config";
import type { DashboardState } from "@/types/dashboard";
import { MyPawlingsRow } from "./my-pawlings-row";
import { SelectedPawlingPanel } from "./selected-pawling-panel";
import { DailyCareSection } from "./daily-care-section";
import { PackMissionsSection } from "./pack-missions-section";
import { RecentActivity } from "./recent-activity";
import { AchievementsCard } from "./achievements-card";
import { SharePawlingModal } from "./share-pawling-modal";
import { DemoControls } from "./demo-controls";
import { WalletStatus } from "./wallet-status";

interface DashboardClientProps {
  xUrl?: string;
  accessMode: "live" | "preview";
}

export function DashboardClient({ xUrl, accessMode }: DashboardClientProps) {
  const wallet = useWalletConnection();
  const { openAdoption } = useAdoptionOverlay();
  const isPreview = accessMode === "preview";
  const [state, setState] = useState<DashboardState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  const [feedLoading, setFeedLoading] = useState(false);
  const [playLoading, setPlayLoading] = useState(false);
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);

  const activeWalletAddress = wallet.isConnected
    ? wallet.address
    : isPreview
      ? dashboardConfig.previewDemoWallet
      : null;

  const sessionActive = Boolean(activeWalletAddress);
  const usingPreviewDemo = isPreview && !wallet.isConnected;

  const fetchState = useCallback(async () => {
    if (!activeWalletAddress) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ wallet: activeWalletAddress });
      if (selectedTokenId) params.set("selected", selectedTokenId);
      const res = await fetch(`/api/dashboard/state?${params.toString()}`);
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Failed to load dashboard.");
      }
      const data = (await res.json()) as DashboardState;
      setState(data);
      setSelectedTokenId(data.selectedTokenId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  }, [activeWalletAddress, selectedTokenId]);

  useEffect(() => {
    if (sessionActive) {
      void fetchState();
    } else {
      setState(null);
    }
  }, [sessionActive, activeWalletAddress, fetchState]);

  function disconnectWallet() {
    wallet.disconnect();
    setState(null);
    setError(null);
  }

  const selectedPawling = useMemo(
    () => state?.pawlings.find((p) => p.tokenId === selectedTokenId) ?? state?.pawlings[0] ?? null,
    [state, selectedTokenId]
  );

  const feedMinutesLeft = selectedPawling
    ? (() => {
        const check = canFeed(selectedPawling);
        return check.ok ? null : check.minutesLeft ?? null;
      })()
    : null;

  const playMinutesLeft = selectedPawling
    ? (() => {
        const check = canPlay(selectedPawling);
        return check.ok ? null : check.minutesLeft ?? null;
      })()
    : null;

  async function handleFeed() {
    if (!activeWalletAddress || !selectedPawling) return;
    setFeedLoading(true);
    setActionMessage(null);
    try {
      const res = await fetch("/api/dashboard/feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: activeWalletAddress, tokenId: selectedPawling.tokenId }),
      });
      const data = (await res.json()) as { error?: string; message?: string };
      if (!res.ok) throw new Error(data.error ?? "Feed failed.");
      setActionMessage(data.message ?? "Fed!");
      await fetchState();
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : "Feed failed.");
    } finally {
      setFeedLoading(false);
    }
  }

  async function handlePlay() {
    if (!activeWalletAddress || !selectedPawling) return;
    setPlayLoading(true);
    setActionMessage(null);
    try {
      const res = await fetch("/api/dashboard/play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: activeWalletAddress, tokenId: selectedPawling.tokenId }),
      });
      const data = (await res.json()) as { error?: string; message?: string };
      if (!res.ok) throw new Error(data.error ?? "Play failed.");
      setActionMessage(
        data.message
          ? `${data.message} +${8} Happiness • +${4} Bond`
          : "Great play session!"
      );
      await fetchState();
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : "Play failed.");
    } finally {
      setPlayLoading(false);
    }
  }

  async function handleMissionComplete(missionId: string) {
    if (!activeWalletAddress) return;
    const res = await fetch("/api/dashboard/missions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet: activeWalletAddress, missionId }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) throw new Error(data.error ?? "Mission failed.");
    await fetchState();
  }

  async function handleCheckIn() {
    if (!activeWalletAddress) return;
    setCheckInLoading(true);
    try {
      const res = await fetch("/api/dashboard/daily-care", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: activeWalletAddress, taskId: "check_in" }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Check-in failed.");
      await fetchState();
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : "Check-in failed.");
    } finally {
      setCheckInLoading(false);
    }
  }

  return (
    <div className="pawlings-page relative min-h-screen overflow-x-hidden">
      <WorldBackground />
      <PawlingsHeader xUrl={xUrl} subpage />

      <main className="relative z-10 pt-28 pb-16 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl space-y-8">
          <header className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <p className="section-eyebrow">{isPreview ? "Preview build" : "Phase 2"}</p>
                <h1 className="font-display font-bold text-pawlings-white text-2xl sm:text-3xl">
                  Welcome back to the Pack 🐾
                </h1>
                <p className="text-pawlings-muted max-w-xl leading-relaxed mt-2">
                  {isPreview
                    ? "Demo pack loaded — Blaze, Jack, Lola & Riot. No wallet needed while we build."
                    : "Your Pawlings have been waiting for you."}
                </p>
              </div>
              {sessionActive ? (
                <WalletStatus
                  displayAddress={wallet.displayAddress ?? ""}
                  connected
                  demo={usingPreviewDemo}
                  onDisconnect={wallet.isConnected ? disconnectWallet : wallet.connect}
                  demoActionLabel={usingPreviewDemo ? "Connect MetaMask" : undefined}
                />
              ) : null}
            </div>
          </header>

          {!sessionActive ? (
            <section className="dashboard-glass rounded-[var(--radius-panel)] px-6 py-14 sm:py-16 text-center max-w-2xl mx-auto">
              <h2 className="font-display text-2xl font-bold text-pawlings-white mb-3">
                Welcome to Your Pawlings Home
              </h2>
              <p className="text-pawlings-muted leading-relaxed mb-6">
                Connect the wallet you used to adopt your Pawlings and we&apos;ll bring your pack home.
              </p>
              {wallet.error ? (
                <p className="text-sm text-red-300 mb-4" role="alert">
                  {wallet.error}
                </p>
              ) : null}
              <GameButton
                type="button"
                onClick={wallet.connect}
                loading={wallet.status === "connecting"}
              >
                Connect Wallet
              </GameButton>
              <p className="text-xs text-pawlings-muted mt-6 max-w-sm mx-auto">
                Pawlings will never ask for your seed phrase or private key.
              </p>
            </section>
          ) : loading && !state ? (
            <p className="text-center text-pawlings-muted py-16" role="status">
              Fetching your Pawlings…
            </p>
          ) : error ? (
            <section className="dashboard-glass rounded-[var(--radius-panel)] px-6 py-12 text-center max-w-lg mx-auto">
              <p className="text-red-300 mb-4" role="alert">
                {error}
              </p>
              <p className="text-sm text-pawlings-muted mb-6">
                {isPreview
                  ? "If this persists, run the holder dashboard migration in Supabase SQL Editor."
                  : "Please try again in a moment."}
              </p>
              <GameButton type="button" variant="secondary" onClick={() => void fetchState()}>
                Try again
              </GameButton>
            </section>
          ) : state?.pawlings.length === 0 ? (
            <section className="dashboard-glass rounded-[var(--radius-panel)] px-6 py-16 text-center">
              <h2 className="font-display text-2xl font-bold text-pawlings-white mb-3">
                No Pawlings found 🐾
              </h2>
              <p className="text-pawlings-muted mb-8 max-w-md mx-auto">
                We couldn&apos;t find a Pawling in this wallet.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {wallet.isConnected ? (
                  <GameButton type="button" variant="secondary" onClick={disconnectWallet}>
                    Try Another Wallet
                  </GameButton>
                ) : null}
                <GameButton type="button" onClick={openAdoption}>
                  Adopt a Pawling
                </GameButton>
              </div>
            </section>
          ) : state && selectedPawling ? (
            <>
              <MyPawlingsRow
                pawlings={state.pawlings}
                selectedTokenId={selectedTokenId}
                onSelect={setSelectedTokenId}
              />

              <SelectedPawlingPanel
                pawling={selectedPawling}
                treats={state.profile.treats}
                feedCost={state.config.feedCost}
                feedMinutesLeft={feedMinutesLeft}
                playMinutesLeft={playMinutesLeft}
                onFeed={handleFeed}
                onPlay={handlePlay}
                feedLoading={feedLoading}
                playLoading={playLoading}
                actionMessage={actionMessage}
              />

              <div className="flex justify-end">
                <GameButton type="button" variant="pink" onClick={() => setShareOpen(true)}>
                  Share My Pawling
                </GameButton>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <DailyCareSection
                  tasks={state.dailyCare}
                  onCheckIn={handleCheckIn}
                  checkInLoading={checkInLoading}
                />
                <PackMissionsSection missions={state.missions} onComplete={handleMissionComplete} />
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <RecentActivity activities={state.activities} />
                <AchievementsCard achievements={state.achievements} />
              </div>

              {isPreview && state.demoMode.previewAuthorized ? (
                <DemoControls wallet={activeWalletAddress!} onRefresh={fetchState} />
              ) : null}
            </>
          ) : null}
        </div>
      </main>

      {selectedPawling ? (
        <SharePawlingModal pawling={selectedPawling} open={shareOpen} onClose={() => setShareOpen(false)} />
      ) : null}

      <PawlingsFooter xUrl={xUrl} />
    </div>
  );
}
