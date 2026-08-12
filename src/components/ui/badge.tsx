import { cn } from "@/lib/utils";
import type { ApplicationStatus } from "@/types/database";

const statusStyles: Record<ApplicationStatus, string> = {
  pending: "bg-foreground-subtle/20 text-foreground-muted border-foreground-subtle/30",
  reviewing: "bg-warning/15 text-warning border-warning/30",
  approved: "bg-success/15 text-success border-success/30",
  waitlisted: "bg-highlight/15 text-highlight border-highlight/30",
  rejected: "bg-error/15 text-error border-error/30",
  archived: "bg-foreground-subtle/10 text-foreground-subtle border-foreground-subtle/20",
};

const statusLabels: Record<ApplicationStatus, string> = {
  pending: "New",
  reviewing: "Reviewing",
  approved: "Approved",
  waitlisted: "Waitlisted",
  rejected: "Not Selected",
  archived: "Archived",
};

export function StatusBadge({
  status,
  className,
}: {
  status: ApplicationStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        statusStyles[status],
        className
      )}
    >
      {statusLabels[status]}
    </span>
  );
}

export function AvailabilityBadge({
  open,
  className,
}: {
  open: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
        open
          ? "bg-success/15 text-success border-success/30"
          : "bg-error/15 text-error border-error/30",
        className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          open ? "bg-success animate-pulse" : "bg-error"
        )}
        aria-hidden
      />
      {open ? "Applications Open" : "Applications Closed"}
    </span>
  );
}
