import { requireAdmin } from "@/lib/admin";
import { AdminShell } from "@/components/admin/admin-shell";
import type { AdminRole } from "@/types/database";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let profile = null;
  try {
    const result = await requireAdmin("read_only");
    profile = result.profile;
  } catch {
    // Login page handled by middleware
  }

  return (
    <AdminShell
      role={(profile?.role as AdminRole) ?? "read_only"}
      displayName={profile?.display_name ?? null}
    >
      {children}
    </AdminShell>
  );
}
