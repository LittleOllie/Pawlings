"use client";

import { cn } from "@/lib/utils";

interface WalletPanelProps {
  address?: string | null;
  connected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  className?: string;
}

function shorten(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function WalletPanel({
  address,
  connected,
  onConnect,
  onDisconnect,
  className,
}: WalletPanelProps) {
  return (
    <div className={cn("dashboard-glass rounded-[var(--radius-panel)] p-5 sm:p-6", className)}>
      <p className="section-eyebrow mb-2">Guardian Wallet</p>
      <h2 className="font-display text-xl font-bold text-pawlings-white mb-3">
        {connected ? "Wallet connected" : "Connect your wallet"}
      </h2>
      <p className="text-sm text-pawlings-muted mb-5 leading-relaxed">
        {connected
          ? "Your Pawlings and care progress will appear here once minting goes live."
          : "Connect to preview your future puppy dashboard. No transactions yet."}
      </p>
      {connected && address ? (
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <code className="rounded-xl bg-black/25 px-3 py-2 text-sm text-pawlings-lime font-mono">
            {shorten(address)}
          </code>
          <button
            type="button"
            onClick={onDisconnect}
            className="text-sm font-display font-bold text-pawlings-muted hover:text-pawlings-white min-h-[44px]"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={onConnect}
          className="btn-pawlings-primary w-full sm:w-auto min-h-[48px] px-8"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
