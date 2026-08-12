"use client";

import { GameButton } from "@/components/pawlings/game-button";

interface DemoControlsProps {
  wallet: string;
  onRefresh: () => void;
}

export function DemoControls({ wallet, onRefresh }: DemoControlsProps) {
  async function run(action: string) {
    await fetch("/api/dashboard/demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet, action }),
    });
    onRefresh();
  }

  async function setDemoView(flags: { forceEmpty?: boolean; forceCount?: number | null }) {
    await fetch("/api/dashboard/demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ demoFlags: flags }),
    });
    onRefresh();
  }

  return (
    <section className="rounded-[var(--radius-panel)] border border-dashed border-amber-400/40 bg-amber-400/5 p-4 sm:p-5">
      <h2 className="font-display text-sm font-bold text-amber-200 mb-3">Demo Controls (preview only)</h2>
      <div className="flex flex-wrap gap-2">
        <GameButton type="button" variant="ghost" onClick={() => run("reset_care")}>
          Reset care
        </GameButton>
        <GameButton type="button" variant="ghost" onClick={() => run("add_treats")}>
          +100 Treats
        </GameButton>
        <GameButton type="button" variant="ghost" onClick={() => setDemoView({ forceEmpty: true, forceCount: null })}>
          Empty wallet view
        </GameButton>
        <GameButton type="button" variant="ghost" onClick={() => setDemoView({ forceEmpty: false, forceCount: 1 })}>
          1 Pawling
        </GameButton>
        <GameButton type="button" variant="ghost" onClick={() => setDemoView({ forceEmpty: false, forceCount: 4 })}>
          Full pack (4)
        </GameButton>
        <GameButton type="button" variant="ghost" onClick={() => setDemoView({ forceEmpty: false, forceCount: null })}>
          Reset view
        </GameButton>
      </div>
    </section>
  );
}
