"use client";

import { cn } from "@/lib/utils";
import { pawlingsContent } from "@/config/pawlings-content";

export type XVerificationState = "pending" | "following" | "verified";

interface XVerificationStatusProps {
  xHandle?: string;
  following?: XVerificationState;
  verified?: XVerificationState;
  className?: string;
}

function StatusRow({
  label,
  state,
}: {
  label: string;
  state: XVerificationState;
}) {
  const copy = pawlingsContent.adoption.xVerification;

  const labels: Record<XVerificationState, string> = {
    pending: copy.pending,
    following: copy.following,
    verified: copy.verified,
  };

  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-paper-text-muted">{label}</span>
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-display font-bold",
          state === "verified" && "bg-pawlings-lime/15 text-pawlings-navy-900",
          state === "following" && "bg-pawlings-yellow/15 text-pawlings-navy-900",
          state === "pending" && "bg-paper-muted/40 text-paper-text-muted"
        )}
      >
        <span aria-hidden>{state === "verified" ? "✓" : state === "following" ? "✓" : "○"}</span>
        {labels[state]}
      </span>
    </div>
  );
}

export function XVerificationStatus({
  xHandle,
  following = "pending",
  verified = "pending",
  className,
}: XVerificationStatusProps) {
  const copy = pawlingsContent.adoption.xVerification;

  if (!xHandle?.trim()) return null;

  return (
    <div className={cn("adoption-x-status rounded-xl border border-paper-border p-3 space-y-2", className)}>
      <p className="text-xs font-display font-bold uppercase tracking-wider text-paper-text-muted">
        {copy.heading}
      </p>
      <StatusRow label={copy.followingLabel} state={following} />
      <StatusRow label={copy.verifiedLabel} state={verified} />
      <p className="text-[11px] text-paper-text-muted leading-relaxed pt-1">
        {copy.notePrefix}{" "}
        <a
          href={pawlingsContent.brand.xUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-pawlings-purple underline underline-offset-2 hover:text-pawlings-orange"
        >
          {pawlingsContent.brand.xHandle}
        </a>{" "}
        {copy.noteSuffix}
      </p>
    </div>
  );
}
