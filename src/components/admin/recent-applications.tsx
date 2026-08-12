import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";
import type { ApplicationStatus } from "@/types/database";
import { ArrowRight } from "lucide-react";
import { CopyWalletButton } from "./copy-wallet-button";

interface RecentApplication {
  id: string;
  reference_code: string;
  wallet_address: string;
  status: ApplicationStatus;
  submitted_at: string;
  x_handle: string | null;
  discord_username?: string | null;
}

interface RecentApplicationsProps {
  applications: RecentApplication[];
  timezone?: string;
  title?: string;
  viewAllHref?: string;
  emptyMessage?: string;
}

export function RecentApplications({
  applications,
  timezone = "UTC",
  title = "Recent submissions",
  viewAllHref = "/admin/applications",
  emptyMessage = "No applications yet.",
}: RecentApplicationsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
        <Link
          href={viewAllHref}
          className="text-sm text-accent hover:text-accent-hover flex items-center gap-1"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        {applications.length === 0 ? (
          <p className="text-sm text-foreground-muted py-8 text-center px-6">
            {emptyMessage}
          </p>
        ) : (
          <ul className="divide-y divide-border-subtle">
            {applications.map((app) => (
              <li key={app.id}>
                <Link
                  href={`/admin/applications/${app.id}`}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 px-6 py-4 hover:bg-surface/40 transition-colors"
                >
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-foreground">
                        {app.reference_code}
                      </span>
                      <StatusBadge status={app.status} />
                    </div>
                    <div className="flex items-start gap-2">
                      <code className="text-xs font-mono text-foreground break-all leading-relaxed">
                        {app.wallet_address}
                      </code>
                      <CopyWalletButton address={app.wallet_address} />
                    </div>
                    {(app.x_handle || app.discord_username) && (
                      <p className="text-xs text-foreground-muted">
                        {[app.x_handle, app.discord_username && `Discord: ${app.discord_username}`]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-foreground-subtle shrink-0 sm:text-right">
                    {formatDateTime(app.submitted_at, timezone)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
