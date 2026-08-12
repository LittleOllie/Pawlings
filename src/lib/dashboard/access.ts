import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { dashboardConfig } from "@/config/dashboard-config";
import { getAdminProfile } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

const PREVIEW_SALT = "pawlings-dashboard-preview-v1";

function getPreviewSecret(): string {
  const password = process.env.PAWLINGS_DASHBOARD_PREVIEW_PASSWORD;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!password) return "";
  return createHmac("sha256", serviceKey ?? "pawlings-fallback")
    .update(`${password}:${PREVIEW_SALT}`)
    .digest("hex");
}

export function createPreviewSessionToken(): string {
  return getPreviewSecret();
}

export function isValidPreviewSessionToken(token: string | undefined): boolean {
  const expected = getPreviewSecret();
  if (!expected || !token) return false;
  try {
    const a = Buffer.from(token);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function hasAdminDashboardAccess(): Promise<boolean> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;
    const profile = await getAdminProfile(user.id);
    return Boolean(profile);
  } catch {
    return false;
  }
}

export async function hasPreviewDashboardAccess(): Promise<boolean> {
  if (dashboardConfig.live) return true;
  if (await hasAdminDashboardAccess()) return true;

  const cookieStore = await cookies();
  const token = cookieStore.get(dashboardConfig.preview.cookieName)?.value;
  return isValidPreviewSessionToken(token);
}

export type DashboardAccessMode = "live" | "preview" | "locked";

export async function getDashboardAccessMode(): Promise<DashboardAccessMode> {
  if (dashboardConfig.live) return "live";
  if (await hasPreviewDashboardAccess()) return "preview";
  return "locked";
}

export function isDashboardNavVisible(mode: DashboardAccessMode): boolean {
  return mode === "live";
}
