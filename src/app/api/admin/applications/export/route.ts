import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, logAudit } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase/admin";
import { handleApiError } from "@/lib/api-utils";
import { canExport } from "@/lib/permissions";
import { applicationsToCsv, APPLICATION_EXPORT_FIELDS } from "@/lib/csv";
import type { ApplicationStatus } from "@/types/database";

export async function GET(request: NextRequest) {
  try {
    const { profile } = await requireAdmin("reviewer");
    if (!canExport(profile.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const supabase = createServiceClient();
    const { searchParams } = request.nextUrl;
    const status = searchParams.get("status") ?? "";

    let query = supabase
      .from("applications")
      .select("*")
      .is("archived_at", null)
      .order("submitted_at", { ascending: false });

    if (status) {
      query = query.eq("status", status as ApplicationStatus);
    }

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ error: "Export failed" }, { status: 500 });
    }

    const appIds = (data ?? []).map((a) => a.id);
    const tagMap = new Map<string, string>();

    if (appIds.length > 0) {
      const { data: assignments } = await supabase
        .from("application_tag_assignments")
        .select("application_id, application_tags ( name )")
        .in("application_id", appIds);

      for (const row of assignments ?? []) {
        const assignment = row as {
          application_id: string;
          application_tags: { name: string };
        };
        const existing = tagMap.get(assignment.application_id);
        const name = assignment.application_tags.name;
        tagMap.set(
          assignment.application_id,
          existing ? `${existing}; ${name}` : name
        );
      }
    }

    const reviewerIds = [
      ...new Set((data ?? []).map((a) => a.reviewed_by).filter(Boolean)),
    ] as string[];
    const reviewerMap = new Map<string, string>();

    if (reviewerIds.length > 0) {
      const { data: reviewers } = await supabase
        .from("admin_profiles")
        .select("id, display_name")
        .in("id", reviewerIds);
      for (const r of reviewers ?? []) {
        reviewerMap.set(r.id, r.display_name ?? "");
      }
    }

    const rows = (data ?? []).map((app) => ({
      reference_code: app.reference_code,
      wallet_address: app.wallet_address,
      x_handle: app.x_handle ?? "",
      discord_username: app.discord_username ?? "",
      status: app.status,
      tags: tagMap.get(app.id) ?? "",
      review_notes: app.review_notes ?? "",
      reviewer: app.reviewed_by ? reviewerMap.get(app.reviewed_by) ?? "" : "",
      submitted_at: app.submitted_at,
      reviewed_at: app.reviewed_at ?? "",
    }));

    const csv = applicationsToCsv(rows, [...APPLICATION_EXPORT_FIELDS]);

    await logAudit(profile.id, "export", "applications", undefined, {
      count: rows.length,
      status: status || "all",
    });

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="applications-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
