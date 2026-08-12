import { Suspense } from "react";
import { requireAdminPage } from "@/lib/admin-page";
import { PageHeader } from "@/components/admin/page-header";
import { ApplicationsTable } from "@/components/admin/applications-table";
import { createServiceClient } from "@/lib/supabase/admin";
import { canReview } from "@/lib/permissions";
import type { Application, ApplicationStatus } from "@/types/database";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

async function fetchApplications(
  params: Record<string, string | string[] | undefined>
) {
  const supabase = createServiceClient();
  const search = String(params.search ?? "").trim();
  const status = String(params.status ?? "");
  const tag = String(params.tag ?? "");
  const dateFrom = String(params.dateFrom ?? "");
  const dateTo = String(params.dateTo ?? "");
  const sort = String(params.sort ?? "submitted_at");
  const order = params.order === "asc";
  const page = Math.max(1, parseInt(String(params.page ?? "1"), 10));
  const limit = status === "pending" ? 50 : 20;
  const offset = (page - 1) * limit;

  let query = supabase
    .from("applications")
    .select("*", { count: "exact" })
    .is("archived_at", null);

  if (status) query = query.eq("status", status as ApplicationStatus);
  if (search) {
    query = query.or(
      `reference_code.ilike.%${search}%,wallet_address.ilike.%${search}%,x_handle.ilike.%${search}%,email.ilike.%${search}%,discord_username.ilike.%${search}%`
    );
  }
  if (dateFrom) query = query.gte("submitted_at", dateFrom);
  if (dateTo) query = query.lte("submitted_at", `${dateTo}T23:59:59.999Z`);

  const validSortFields = ["submitted_at", "status", "reference_code", "wallet_address"];
  const sortField = validSortFields.includes(sort) ? sort : "submitted_at";
  query = query.order(sortField, { ascending: order }).range(offset, offset + limit - 1);

  const { data, count } = await query;
  const applications = (data ?? []) as Application[];

  const appIds = applications.map((a) => a.id);
  const tagMap = new Map<string, Array<{ id: string; name: string; color: string }>>();

  if (appIds.length > 0) {
    const { data: assignments } = await supabase
      .from("application_tag_assignments")
      .select("application_id, application_tags ( id, name, color )")
      .in("application_id", appIds);

    for (const row of assignments ?? []) {
      const assignment = row as {
        application_id: string;
        application_tags: { id: string; name: string; color: string };
      };
      const list = tagMap.get(assignment.application_id) ?? [];
      list.push(assignment.application_tags);
      tagMap.set(assignment.application_id, list);
    }
  }

  let result = applications.map((app) => ({
    ...app,
    tags: tagMap.get(app.id) ?? [],
  }));

  if (tag) {
    result = result.filter((app) =>
      app.tags.some((t) => t.id === tag || t.name === tag)
    );
  }

  const { data: allTags } = await supabase.from("application_tags").select("*").order("name");

  return {
    applications: result,
    tags: allTags ?? [],
    pagination: {
      page,
      limit,
      total: count ?? 0,
      totalPages: Math.ceil((count ?? 0) / limit),
    },
  };
}

export default async function ApplicationsPage({ searchParams }: PageProps) {
  const profile = await requireAdminPage("read_only");
  const params = await searchParams;
  const data = await fetchApplications(params);

  return (
    <div>
      <PageHeader
        title="Applications"
        description={`${data.pagination.total.toLocaleString()} total applications`}
      />
      <Suspense fallback={<p className="text-foreground-muted">Loading…</p>}>
        <ApplicationsTable initialData={data} canReview={canReview(profile.role)} />
      </Suspense>
    </div>
  );
}
