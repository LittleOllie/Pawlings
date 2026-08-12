import { PawlingsExperience } from "@/components/pawlings/pawlings-experience";
import { getSiteSettings, getContentBlock } from "@/lib/settings";
import { getApplicationAvailability } from "@/lib/application-status";
import { createServiceClient } from "@/lib/supabase/admin";

export default async function HomePage() {
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
    <PawlingsExperience
      canSubmit={availability.canSubmit}
      closedMessage={closedMessage || availability.message}
      xUrl={settings.x_url || undefined}
      discordUrl={settings.discord_url || undefined}
    />
  );
}
