"use client";

import { useState } from "react";
import Link from "next/link";
import { GameButton } from "@/components/pawlings/game-button";

export function DashboardComingSoon() {
  return (
    <div className="pawlings-page relative min-h-screen overflow-x-hidden flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-24">
        <section className="dashboard-glass max-w-lg w-full rounded-[var(--radius-panel)] px-8 py-12 text-center">
          <p className="text-5xl mb-6" aria-hidden>
            🐾
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-pawlings-white mb-4">
            THE KENNELS AREN&apos;T OPEN YET 🐾
          </h1>
          <p className="text-pawlings-muted leading-relaxed mb-8">
            Pawlings holders will be able to care for their pups here after adoption.
          </p>
          <Link href="/" className="btn-pawlings-primary inline-flex w-full items-center justify-center min-h-[48px] font-display font-bold">
            Back to Pawlings
          </Link>
        </section>
      </main>
    </div>
  );
}

interface DashboardPreviewLoginProps {
  onSuccess: () => void;
}

export function DashboardPreviewLogin({ onSuccess }: DashboardPreviewLoginProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/dashboard/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Preview login failed.");
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Preview login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pawlings-page relative min-h-screen overflow-x-hidden flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-24">
        <section className="dashboard-glass max-w-md w-full rounded-[var(--radius-panel)] px-8 py-10">
          <p className="section-eyebrow mb-2">Preview access</p>
          <h1 className="font-display text-2xl font-bold text-pawlings-white mb-3">
            Kennel preview
          </h1>
          <p className="text-sm text-pawlings-muted mb-6 leading-relaxed">
            Enter the preview password to explore the holder dashboard before mint.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-left">
              <span className="sr-only">Preview password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-pawlings-white min-h-[48px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pawlings-lime"
                autoComplete="current-password"
                required
              />
            </label>
            {error ? (
              <p className="text-sm text-red-300" role="alert">
                {error}
              </p>
            ) : null}
            <GameButton type="submit" fullWidth loading={loading}>
              Enter preview
            </GameButton>
            <Link
              href="/"
              className="block text-center text-sm text-pawlings-muted hover:text-pawlings-white min-h-[44px] leading-[44px]"
            >
              Back to Pawlings
            </Link>
          </form>
        </section>
      </main>
    </div>
  );
}
