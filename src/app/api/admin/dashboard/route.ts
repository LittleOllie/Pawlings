import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase/admin";
import { getSiteSettingsAdmin } from "@/lib/settings";
import { getApplicationAvailability } from "@/lib/application-status";
import { handleApiError } from "@/lib/api-utils";
import type { ApplicationStatus } from "@/types/database";

export async function GET() {
  try {
    await requireAdmin("read_only");
    const supabase = createServiceClient();
    const settings = await getSiteSettingsAdmin();

    const statuses: ApplicationStatus[] = [
      "pending",
      "reviewing",
      "approved",
      "waitlisted",
      "rejected",
    ];

    const statusCounts = await Promise.all(
      statuses.map(async (status) => {
        const { count } = await supabase
          .from("applications")
          .select("*", { count: "exact", head: true })
          .eq("status", status)
          .is("archived_at", null);
        return { status, count: count ?? 0 };
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
      pending: statusCounts.find((s) => s.status === "pending")?.count ?? 0,
      reviewing: statusCounts.find((s) => s.status === "reviewing")?.count ?? 0,
      approved: statusCounts.find((s) => s.status === "approved")?.count ?? 0,
      waitlisted: statusCounts.find((s) => s.status === "waitlisted")?.count ?? 0,
      rejected: statusCounts.find((s) => s.status === "rejected")?.count ?? 0,
      today: today ?? 0,
      lastSevenDays: lastSevenDays ?? 0,
      approvedWallets: approvedWallets ?? 0,
    };

    const { data: recentApplications } = await supabase
      .from("applications")
      .select("id, reference_code, wallet_address, status, submitted_at, x_handle")
      .is("archived_at", null)
      .order("submitted_at", { ascending: false })
      .limit(8);

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

    return NextResponse.json({
      stats,
      recentApplications: recentApplications ?? [],
      activity,
      siteStatus: {
        availability: availability.status,
        message: availability.message,
        canSubmit: availability.canSubmit,
        applicationsOpen: settings.applications_open,
        applicationsPaused: settings.applications_paused,
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
