import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/admin-page";
import { ApplicationDetail } from "@/components/admin/application-detail";
import { createServiceClient } from "@/lib/supabase/admin";
import { canReview } from "@/lib/permissions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ApplicationDetailPage({ params }: PageProps) {
  const profile = await requireAdminPage("read_only");
  const { id } = await params;
  const supabase = createServiceClient();

  const { data: application } = await supabase
    .from("applications")
    .select("*")
    .eq("id", id)
    .single();

  if (!application) notFound();

  const { data: tagAssignments } = await supabase
    .from("application_tag_assignments")
    .select("tag_id, application_tags ( id, name, color )")
    .eq("application_id", id);

  const { data: notes } = await supabase
    .from("application_notes")
    .select("*, admin_profiles ( display_name )")
    .eq("application_id", id)
    .order("created_at", { ascending: false });

  const { data: history } = await supabase
    .from("application_status_history")
    .select("*, admin_profiles ( display_name )")
    .eq("application_id", id)
    .order("created_at", { ascending: false });

  let reviewer = null;
  if (application.reviewed_by) {
    const { data } = await supabase
      .from("admin_profiles")
      .select("display_name, role")
      .eq("id", application.reviewed_by)
      .single();
    reviewer = data;
  }

  const { data: allTags } = await supabase.from("application_tags").select("*").order("name");

  const { data: approvedWallet } = await supabase
    .from("approved_wallets")
    .select("id")
    .eq("wallet_address_normalized", application.wallet_address_normalized)
    .maybeSingle();

  const tags =
    (tagAssignments ?? []).map(
      (t) =>
        (t as { application_tags: { id: string; name: string; color: string } })
          .application_tags
    ) ?? [];

  return (
    <ApplicationDetail
      application={application}
      tags={tags}
      allTags={allTags ?? []}
      notes={(notes ?? []) as Parameters<typeof ApplicationDetail>[0]["notes"]}
      history={(history ?? []) as Parameters<typeof ApplicationDetail>[0]["history"]}
      reviewer={reviewer}
      isApprovedWallet={Boolean(approvedWallet)}
      canReview={canReview(profile.role)}
    />
  );
}
