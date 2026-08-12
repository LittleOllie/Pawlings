import { DashboardExperience } from "@/components/pawlings/dashboard/dashboard-experience";
import { getSiteSettings, getContentBlock } from "@/lib/settings";
import { getApplicationAvailability } from "@/lib/application-status";
import { createServiceClient } from "@/lib/supabase/admin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
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

  return (
    <DashboardExperience
      canSubmit={availability.canSubmit}
      closedMessage={closedMessage || availability.message}
      xUrl={settings.x_url || undefined}
    />
  );
}
