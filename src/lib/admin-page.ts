import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import type { AdminRole } from "@/types/database";

export async function requireAdminPage(minRole: AdminRole = "read_only") {
  try {
    const { profile } = await requireAdmin(minRole);
    return profile;
  } catch {
    redirect("/admin/login");
  }
}
