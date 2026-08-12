import { createServiceClient } from "./supabase/admin";
import type { AdminRole } from "@/types/database";

import type { AdminProfile } from "@/types/database";

export async function getAdminProfile(userId: string): Promise<AdminProfile | null> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("admin_profiles")
    .select("*")
    .eq("id", userId)
    .eq("is_active", true)
    .single();

  return data as AdminProfile | null;
}

export async function requireAdmin(minRole: AdminRole = "reviewer") {
  const { createClient } = await import("./supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const profile = await getAdminProfile(user.id);
  if (!profile) {
    throw new Error("Unauthorized");
  }

  const { hasMinRole } = await import("./permissions");
  if (!hasMinRole(profile.role as AdminRole, minRole)) {
    throw new Error("Forbidden");
  }

  return { user, profile };
}

export async function logAudit(
  adminId: string | null,
  action: string,
  entityType: string,
  entityId?: string,
  metadata: Record<string, unknown> = {}
) {
  const supabase = createServiceClient();
  await supabase.from("admin_audit_log").insert({
    admin_id: adminId,
    action,
    entity_type: entityType,
    entity_id: entityId ?? null,
    metadata: metadata as Record<string, string | number | boolean | null>,
  });
}
