import { redirect } from "next/navigation";
import { requireAdminPage } from "@/lib/admin-page";
import { PageHeader } from "@/components/admin/page-header";
import { TeamManager } from "@/components/admin/team-manager";
import { createServiceClient } from "@/lib/supabase/admin";
import { canManageTeam } from "@/lib/permissions";

export default async function TeamPage() {
  const profile = await requireAdminPage("owner");
  if (!canManageTeam(profile.role)) redirect("/admin");

  const supabase = createServiceClient();
  const { data: profiles } = await supabase
    .from("admin_profiles")
    .select("*")
    .order("created_at", { ascending: true });

  const { data: authData } = await supabase.auth.admin.listUsers();
  const emailMap = new Map(authData.users.map((u) => [u.id, u.email ?? ""]));

  const team = (profiles ?? []).map((p) => ({ ...p, email: emailMap.get(p.id) ?? "" }));

  return (
    <div>
      <PageHeader title="Team" description="Manage admin users and roles." />
      <TeamManager team={team} />
    </div>
  );
}
