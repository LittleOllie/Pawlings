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
import { z } from "zod";

const patchSchema = z.object({
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
  tagIds: z.array(z.string().uuid()).optional(),
  note: z.string().min(1).optional(),
  addToApprovedWallets: z.boolean().optional(),
  allocation_type: z.string().nullable().optional(),
  allocation_amount: z.number().nullable().optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin("read_only");
    const { id } = await params;
    const supabase = createServiceClient();

    const { data: application, error } = await supabase
      .from("applications")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !application) {
      return jsonError("Application not found", 404);
    }

    const { data: tags } = await supabase
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
      const { data: reviewerProfile } = await supabase
        .from("admin_profiles")
        .select("display_name, role")
        .eq("id", application.reviewed_by)
        .single();
      reviewer = reviewerProfile;
    }

    const { data: allTags } = await supabase
      .from("application_tags")
      .select("*")
      .order("name");

    const { data: approvedWallet } = await supabase
      .from("approved_wallets")
      .select("id")
      .eq("wallet_address_normalized", application.wallet_address_normalized)
      .maybeSingle();

    return NextResponse.json({
      application,
      tags:
        tags?.map(
          (t: { application_tags: { id: string; name: string; color: string } }) =>
            t.application_tags
        ) ?? [],
      notes: notes ?? [],
      history: history ?? [],
      reviewer,
      allTags: allTags ?? [],
      isApprovedWallet: Boolean(approvedWallet),
    });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { profile } = await requireAdmin("reviewer");
    if (!canReview(profile.role)) {
      return jsonError("Forbidden", 403);
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(
        parsed.error.errors[0]?.message ?? "Invalid request",
        400
      );
    }

    const supabase = createServiceClient();
    const now = new Date().toISOString();

    const { data: existing } = await supabase
      .from("applications")
      .select("*")
      .eq("id", id)
      .single();

    if (!existing) {
      return jsonError("Application not found", 404);
    }

    const {
      status,
      review_notes,
      tagIds,
      note,
      addToApprovedWallets,
      allocation_type,
      allocation_amount,
    } = parsed.data;

    if (status) {
      const updates = {
        status,
        reviewed_by: profile.id,
        reviewed_at: now,
        updated_at: now,
        ...(review_notes !== undefined ? { review_notes } : {}),
        ...(status === "archived" ? { archived_at: now } : {}),
      };

      const { error } = await supabase
        .from("applications")
        .update(updates)
        .eq("id", id);

      if (error) {
        return jsonError("Failed to update application", 500);
      }

      await supabase.from("application_status_history").insert({
        application_id: id,
        from_status: existing.status,
        to_status: status,
        changed_by: profile.id,
      });

      if (status === "approved" && addToApprovedWallets) {
        const normalized = existing.wallet_address_normalized;
        const { data: walletExists } = await supabase
          .from("approved_wallets")
          .select("id")
          .eq("wallet_address_normalized", normalized)
          .maybeSingle();

        if (!walletExists && isValidWalletAddress(existing.wallet_address)) {
          await supabase.from("approved_wallets").insert({
            wallet_address: formatWalletForDisplay(existing.wallet_address),
            wallet_address_normalized: normalizeWalletAddress(
              existing.wallet_address
            ),
            source: "application",
            application_id: id,
            allocation_type: allocation_type ?? null,
            allocation_amount: allocation_amount ?? null,
            added_by: profile.id,
          });
        }
      }
    } else if (review_notes !== undefined) {
      await supabase
        .from("applications")
        .update({ review_notes, updated_at: now })
        .eq("id", id);
    }

    if (tagIds !== undefined) {
      await supabase
        .from("application_tag_assignments")
        .delete()
        .eq("application_id", id);

      if (tagIds.length > 0) {
        await supabase.from("application_tag_assignments").insert(
          tagIds.map((tagId) => ({
            application_id: id,
            tag_id: tagId,
            assigned_by: profile.id,
          }))
        );
      }
    }

    if (note) {
      await supabase.from("application_notes").insert({
        application_id: id,
        admin_id: profile.id,
        note,
      });
    }

    await logAudit(profile.id, "update", "application", id, {
      status,
      addToApprovedWallets,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
