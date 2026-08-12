import { DashboardExperience } from "@/components/pawlings/dashboard/dashboard-experience";
import { getDashboardAccessMode } from "@/lib/dashboard/access";
import { getSiteSettings, getContentBlock } from "@/lib/settings";
import { getApplicationAvailability } from "@/lib/application-status";
import { createServiceClient } from "@/lib/supabase/admin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Pawlings",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const accessMode = await getDashboardAccessMode();
  const settings = await getSiteSettings();
  const closedMessage = await getContentBlock("closed_message");

  let applicationCount = 0;
  try {
    const supabase = createServiceClient();
    const { count } = await supabase
      .from("applications")
      .select("*", { count: "exact", head: true })
      .is("archived_at", null);
    applicationCount = count ?? 0;
  } catch {
    // Supabase not configured
  }

  const availability = getApplicationAvailability(settings, applicationCount);
  const previewConfigured = Boolean(process.env.PAWLINGS_DASHBOARD_PREVIEW_PASSWORD);

  return (
    <DashboardExperience
      canSubmit={availability.canSubmit}
      closedMessage={closedMessage || availability.message}
      xUrl={settings.x_url || undefined}
      accessMode={accessMode}
      previewConfigured={previewConfigured}
    />
  );
}
