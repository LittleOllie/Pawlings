import { requireAdminPage } from "@/lib/admin-page";
import { PageHeader } from "@/components/admin/page-header";
import { createServiceClient } from "@/lib/supabase/admin";
import { formatDateTime } from "@/lib/utils";
import type { ApplicationStatus, CollaborationApplication } from "@/types/database";

export default async function AdminCollaborationsPage() {
  await requireAdminPage();
  const supabase = createServiceClient();

  const { data } = await supabase
    .from("collaboration_applications" as "applications")
    .select("*")
    .order("submitted_at", { ascending: false })
    .limit(100);

  const applications = (data ?? []) as unknown as CollaborationApplication[];

  return (
    <>
      <PageHeader
        title="Collaborations"
        description="Community collaboration applications — separate from adoption submissions."
      />

      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-foreground-muted">
                <th className="px-4 py-3 font-medium">Submitted</th>
                <th className="px-4 py-3 font-medium">Reference</th>
                <th className="px-4 py-3 font-medium">Collection</th>
                <th className="px-4 py-3 font-medium">X</th>
                <th className="px-4 py-3 font-medium">Spots</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-foreground-muted">
                    No collaboration applications yet.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="border-b border-border-subtle hover:bg-surface-hover/50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      {formatDateTime(app.submitted_at)}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{app.reference_code}</td>
                    <td className="px-4 py-3 font-medium">{app.collection_name}</td>
                    <td className="px-4 py-3">{app.x_handle ?? "—"}</td>
                    <td className="px-4 py-3 tabular-nums">{app.spots_requested ?? "—"}</td>
                    <td className="px-4 py-3 capitalize">{(app.status as ApplicationStatus).replace("_", " ")}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
