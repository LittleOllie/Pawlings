import { requireAdminPage } from "@/lib/admin-page";
import { PageHeader } from "@/components/admin/page-header";
import { StatsCards } from "@/components/admin/stats-cards";
import { DashboardQuickActions } from "@/components/admin/dashboard-quick-actions";
import { ActivityChart } from "@/components/admin/activity-chart";
import { RecentApplications } from "@/components/admin/recent-applications";
import { SiteStatusCard } from "@/components/admin/site-status-card";
import { getSiteSettingsAdmin } from "@/lib/settings";

export default async function AdminDashboardPage() {
  await requireAdminPage("read_only");

  const settings = await getSiteSettingsAdmin();
  const { createServiceClient } = await import("@/lib/supabase/admin");
  const { getApplicationAvailability } = await import("@/lib/application-status");
  const supabase = createServiceClient();

  const statuses = ["pending", "reviewing", "approved", "waitlisted", "rejected"] as const;
  const statusCounts = await Promise.all(
    statuses.map(async (status) => {
      const { count } = await supabase
        .from("applications")
        .select("*", { count: "exact", head: true })
        .eq("status", status)
        .is("archived_at", null);
      return count ?? 0;
    })
  );

  const { count: total } = await supabase
    .from("applications")
    .select("*", { count: "exact", head: true })
    .is("archived_at", null);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const { count: today } = await supabase
    .from("applications")
    .select("*", { count: "exact", head: true })
    .gte("submitted_at", todayStart.toISOString())
    .is("archived_at", null);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const { count: lastSevenDays } = await supabase
    .from("applications")
    .select("*", { count: "exact", head: true })
    .gte("submitted_at", sevenDaysAgo.toISOString())
    .is("archived_at", null);

  const { count: approvedWallets } = await supabase
    .from("approved_wallets")
    .select("*", { count: "exact", head: true });

  const stats = {
    total: total ?? 0,
    pending: statusCounts[0],
    reviewing: statusCounts[1],
    approved: statusCounts[2],
    waitlisted: statusCounts[3],
    rejected: statusCounts[4],
    today: today ?? 0,
    lastSevenDays: lastSevenDays ?? 0,
    approvedWallets: approvedWallets ?? 0,
  };

  const { data: recentApplications } = await supabase
    .from("applications")
    .select("id, reference_code, wallet_address, status, submitted_at, x_handle, discord_username")
    .is("archived_at", null)
    .order("submitted_at", { ascending: false })
    .limit(10);

  const { data: pendingApplications } = await supabase
    .from("applications")
    .select("id, reference_code, wallet_address, status, submitted_at, x_handle, discord_username")
    .eq("status", "pending")
    .is("archived_at", null)
    .order("submitted_at", { ascending: false })
    .limit(5);

  const { data: recentSubmissions } = await supabase
    .from("applications")
    .select("submitted_at")
    .gte("submitted_at", sevenDaysAgo.toISOString())
    .is("archived_at", null);

  const activityMap = new Map<string, number>();
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    activityMap.set(d.toISOString().slice(0, 10), 0);
  }
  for (const row of recentSubmissions ?? []) {
    const key = row.submitted_at.slice(0, 10);
    if (activityMap.has(key)) {
      activityMap.set(key, (activityMap.get(key) ?? 0) + 1);
    }
  }
  const activity = Array.from(activityMap.entries()).map(([date, count]) => ({
    date,
    count,
  }));

  const availability = getApplicationAvailability(settings, stats.total);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={`${stats.total} total submission${stats.total === 1 ? "" : "s"} · ${stats.pending} need review`}
      />

      <StatsCards stats={stats} />
      <DashboardQuickActions />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {(pendingApplications?.length ?? 0) > 0 ? (
            <RecentApplications
              applications={pendingApplications ?? []}
              timezone={settings.display_timezone}
              title="Waiting for review"
              viewAllHref="/admin/applications?status=pending"
              emptyMessage="No pending applications."
            />
          ) : null}
          <RecentApplications
            applications={recentApplications ?? []}
            timezone={settings.display_timezone}
          />
        </div>
        <div className="space-y-6">
          <SiteStatusCard
            siteStatus={{
              availability: availability.status,
              message: availability.message,
              canSubmit: availability.canSubmit,
              applicationsOpen: settings.applications_open,
              applicationsPaused: settings.applications_paused,
            }}
          />
          <ActivityChart data={activity} />
        </div>
      </div>
    </div>
  );
}
