"use client";

interface WalletStatusProps {
  displayAddress: string;
  connected: boolean;
  onDisconnect: () => void;
  demo?: boolean;
  demoActionLabel?: string;
}

export function WalletStatus({
  displayAddress,
  connected,
  onDisconnect,
  demo = false,
  demoActionLabel,
}: WalletStatusProps) {
  if (!connected) return null;

  return (
    <div className="flex items-center gap-3 justify-end">
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5">
        <span
          className={`h-2 w-2 rounded-full ${demo ? "bg-amber-400" : "bg-emerald-400"}`}
          aria-hidden
        />
        <span className="text-xs sm:text-sm text-pawlings-muted font-mono">
          {demo ? "Preview · Full pack" : displayAddress}
        </span>
      </div>
      <button
        type="button"
        onClick={onDisconnect}
        className="text-xs text-pawlings-muted hover:text-pawlings-white min-h-[44px] px-2"
      >
        {demo ? demoActionLabel ?? "Connect MetaMask" : "Disconnect"}
      </button>
    </div>
  );
}
