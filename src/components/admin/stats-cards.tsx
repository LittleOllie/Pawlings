import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { DashboardStats } from "@/types/database";
import {
  Clock,
  CheckCircle,
  FileText,
  Wallet,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const primary = [
    {
      key: "pending",
      label: "Needs review",
      value: stats.pending,
      icon: Clock,
      accent: "text-warning border-warning/30 bg-warning/10",
      href: "/admin/applications?status=pending",
    },
    {
      key: "approved",
      label: "Approved",
      value: stats.approved,
      icon: CheckCircle,
      accent: "text-success border-success/30 bg-success/10",
      href: "/admin/applications?status=approved",
    },
    {
      key: "total",
      label: "Total submissions",
      value: stats.total,
      icon: FileText,
      accent: "text-foreground border-border bg-surface/50",
      href: "/admin/applications",
    },
    {
      key: "approvedWallets",
      label: "Approved guardians",
      value: stats.approvedWallets,
      icon: Wallet,
      accent: "text-accent border-accent/30 bg-accent/10",
      href: "/admin/approved-wallets",
    },
  ] as const;

  return (
    <div className="space-y-4">
      {stats.pending > 0 && (
        <Card className="border-warning/40 bg-warning/5">
          <CardContent className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-warning shrink-0" />
              <div>
                <p className="font-medium text-foreground">
                  {stats.pending} application{stats.pending === 1 ? "" : "s"} waiting
                </p>
                <p className="text-sm text-foreground-muted">
                  Review and approve applications for adoption
                </p>
              </div>
            </div>
            <Link href="/admin/applications?status=pending">
              <Button size="sm">
                Review now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {primary.map(({ key, label, value, icon: Icon, accent, href }) => (
          <Link key={key} href={href} className="group">
            <Card className={`h-full transition-all hover:border-accent/40 hover:scale-[1.02] ${accent.split(" ").slice(2).join(" ")}`}>
              <CardContent className="pt-5 pb-5">
                <div className="flex items-center justify-between mb-3">
                  <Icon className={`h-5 w-5 ${accent.split(" ")[0]}`} />
                  <ArrowRight className="h-4 w-4 text-foreground-subtle opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-3xl font-bold text-foreground tabular-nums">
                  {value.toLocaleString()}
                </p>
                <p className="text-sm text-foreground-muted mt-1">{label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
        <Card className="h-full border-dashed border-border/60 bg-surface/30 opacity-90">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg" aria-hidden>🐶</span>
              <span className="text-[10px] uppercase tracking-widest text-foreground-subtle">Soon</span>
            </div>
            <p className="text-3xl font-bold text-foreground tabular-nums">—</p>
            <p className="text-sm text-foreground-muted mt-1">Puppies alive</p>
          </CardContent>
        </Card>
        <Card className="h-full border-dashed border-border/60 bg-surface/30 opacity-90">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg" aria-hidden>🐕</span>
              <span className="text-[10px] uppercase tracking-widest text-foreground-subtle">Soon</span>
            </div>
            <p className="text-3xl font-bold text-foreground tabular-nums">—</p>
            <p className="text-sm text-foreground-muted mt-1">Adults evolved</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-foreground-muted">
        <span>
          <strong className="text-foreground font-medium">{stats.today}</strong> today
        </span>
        <span>·</span>
        <span>
          <strong className="text-foreground font-medium">{stats.lastSevenDays}</strong> last 7 days
        </span>
        {stats.reviewing > 0 && (
          <>
            <span>·</span>
            <Link href="/admin/applications?status=reviewing" className="text-accent hover:underline">
              {stats.reviewing} reviewing
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
