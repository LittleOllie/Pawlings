import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, logAudit } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase/admin";
import { handleApiError, jsonError } from "@/lib/api-utils";
import { canReview } from "@/lib/permissions";
import {
  normalizeWalletAddress,
  formatWalletForDisplay,
  isValidWalletAddress,
} from "@/lib/wallet";
import type { ApplicationStatus } from "@/types/database";
import { z } from "zod";

const VALID_STATUSES: ApplicationStatus[] = [
  "pending",
  "reviewing",
  "approved",
  "waitlisted",
  "rejected",
  "archived",
];

const bulkPatchSchema = z.object({
  ids: z.array(z.string().uuid()).min(1),
  status: z
    .enum([
      "pending",
      "reviewing",
      "approved",
      "waitlisted",
      "rejected",
      "archived",
    ])
    .optional(),
  review_notes: z.string().nullable().optional(),
  addTagIds: z.array(z.string().uuid()).optional(),
  removeTagIds: z.array(z.string().uuid()).optional(),
  addToApprovedWallets: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  try {
    await requireAdmin("read_only");
    const supabase = createServiceClient();
    const { searchParams } = request.nextUrl;

    const search = searchParams.get("search")?.trim() ?? "";
    const status = searchParams.get("status") ?? "";
    const tag = searchParams.get("tag") ?? "";
    const dateFrom = searchParams.get("dateFrom") ?? "";
    const dateTo = searchParams.get("dateTo") ?? "";
    const sort = searchParams.get("sort") ?? "submitted_at";
    const order = searchParams.get("order") === "asc";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10))
    );
    const offset = (page - 1) * limit;

    let query = supabase
      .from("applications")
      .select("*", { count: "exact" })
      .is("archived_at", null);

    if (status && VALID_STATUSES.includes(status as ApplicationStatus)) {
      query = query.eq("status", status as ApplicationStatus);
    }

    if (search) {
      query = query.or(
        `reference_code.ilike.%${search}%,wallet_address.ilike.%${search}%,x_handle.ilike.%${search}%,email.ilike.%${search}%,discord_username.ilike.%${search}%`
      );
    }

    if (dateFrom) query = query.gte("submitted_at", dateFrom);
    if (dateTo) query = query.lte("submitted_at", `${dateTo}T23:59:59.999Z`);

    const validSortFields = [
      "submitted_at",
      "status",
      "reference_code",
      "wallet_address",
    ];
    const sortField = validSortFields.includes(sort) ? sort : "submitted_at";
    query = query.order(sortField, { ascending: order });
    query = query.range(offset, offset + limit - 1);

    const { data, count, error } = await query;

    if (error) {
      console.error("Applications list error:", error);
      return jsonError("Failed to fetch applications", 500);
    }

    const applications = (data ?? []);
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

    const { data: allTags } = await supabase
      .from("application_tags")
      .select("*")
      .order("name");

    return NextResponse.json({
      applications: result,
      tags: allTags ?? [],
      pagination: {
        page,
        limit,
        total: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / limit),
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { profile } = await requireAdmin("reviewer");
    if (!canReview(profile.role)) {
      return jsonError("Forbidden", 403);
    }

    const body = await request.json();
    const parsed = bulkPatchSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(
        parsed.error.errors[0]?.message ?? "Invalid request",
        400
      );
    }

    const { ids, status, review_notes, addTagIds, removeTagIds, addToApprovedWallets } =
      parsed.data;
    const supabase = createServiceClient();
    const now = new Date().toISOString();

    if (status) {
      const { data: existingApps } = await supabase
        .from("applications")
        .select("id, status, wallet_address, wallet_address_normalized")
        .in("id", ids);

      const updates = {
        status,
        updated_at: now,
        reviewed_by: profile.id,
        reviewed_at: now,
        ...(review_notes !== undefined ? { review_notes } : {}),
        ...(status === "archived" ? { archived_at: now } : {}),
      };

      const { error } = await supabase
        .from("applications")
        .update(updates)
        .in("id", ids);

      if (error) {
        console.error("Bulk status update error:", error);
        return jsonError("Failed to update applications", 500);
      }

      for (const app of existingApps ?? []) {
        await supabase.from("application_status_history").insert({
          application_id: app.id,
          from_status: app.status,
          to_status: status,
          changed_by: profile.id,
        });
      }

      if (status === "approved" && addToApprovedWallets) {
        for (const app of existingApps ?? []) {
          const normalized = app.wallet_address_normalized;
          const { data: walletExists } = await supabase
            .from("approved_wallets")
            .select("id")
            .eq("wallet_address_normalized", normalized)
            .maybeSingle();

          if (!walletExists && isValidWalletAddress(app.wallet_address)) {
            await supabase.from("approved_wallets").insert({
              wallet_address: formatWalletForDisplay(app.wallet_address),
              wallet_address_normalized: normalizeWalletAddress(app.wallet_address),
              source: "application",
              application_id: app.id,
              added_by: profile.id,
            });
          }
        }
      }
    } else if (review_notes !== undefined) {
      const { error } = await supabase
        .from("applications")
        .update({ review_notes, updated_at: now })
        .in("id", ids);

      if (error) {
        return jsonError("Failed to update notes", 500);
      }
    }

    if (addTagIds?.length) {
      const assignments = ids.flatMap((applicationId) =>
        addTagIds.map((tagId) => ({
          application_id: applicationId,
          tag_id: tagId,
          assigned_by: profile.id,
        }))
      );
      await supabase
        .from("application_tag_assignments")
        .upsert(assignments, { onConflict: "application_id,tag_id" });
    }

    if (removeTagIds?.length) {
      for (const applicationId of ids) {
        await supabase
          .from("application_tag_assignments")
          .delete()
          .eq("application_id", applicationId)
          .in("tag_id", removeTagIds);
      }
    }

    await logAudit(profile.id, "bulk_update", "applications", undefined, {
      ids,
      status,
      addTagIds,
      removeTagIds,
      addToApprovedWallets,
    });

    return NextResponse.json({ success: true, updated: ids.length });
  } catch (err) {
    return handleApiError(err);
  }
}
