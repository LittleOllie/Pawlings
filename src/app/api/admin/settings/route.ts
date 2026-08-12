import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, logAudit } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase/admin";
import { getSiteSettingsAdmin } from "@/lib/settings";
import { handleApiError, jsonError } from "@/lib/api-utils";
import { canManageSettings } from "@/lib/permissions";
import { siteSettingsSchema } from "@/lib/validation";

export async function GET() {
  try {
    await requireAdmin("read_only");
    const settings = await getSiteSettingsAdmin();
    return NextResponse.json({ settings });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { profile } = await requireAdmin("admin");
    if (!canManageSettings(profile.role)) {
      return jsonError("Forbidden", 403);
    }

    const body = await request.json();
    const parsed = siteSettingsSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(
        parsed.error.errors[0]?.message ?? "Invalid settings",
        400
      );
    }

    const supabase = createServiceClient();
    const settings = await getSiteSettingsAdmin();

    const { data, error } = await supabase
      .from("site_settings")
      .update({
        ...parsed.data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", settings.id)
      .select()
      .single();

    if (error) {
      console.error("Settings update error:", error);
      return jsonError("Failed to update settings", 500);
    }

    await logAudit(profile.id, "update", "site_settings", settings.id, {
      fields: Object.keys(parsed.data),
    });

    return NextResponse.json({ settings: data });
  } catch (err) {
    return handleApiError(err);
  }
}
