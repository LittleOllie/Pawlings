import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, logAudit } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    await requireAdmin("owner");
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("admin_profiles")
      .select("*")
      .order("created_at");

    return NextResponse.json({ members: data ?? [] });
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAdmin("owner");
    const { email, role } = await request.json();
    const supabase = createServiceClient();

    const { data: inviteData, error: inviteError } =
      await supabase.auth.admin.inviteUserByEmail(email);

    if (inviteError) {
      return NextResponse.json({ error: inviteError.message }, { status: 400 });
    }

    if (inviteData.user) {
      await supabase.from("admin_profiles").insert({
        id: inviteData.user.id,
        role: role ?? "reviewer",
        display_name: email.split("@")[0],
      });
    }

    await logAudit(user.id, "admin_invited", "admin_profile", inviteData.user?.id, {
      email,
      role,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: message }, { status: 403 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { user } = await requireAdmin("owner");
    const { id, role } = await request.json();
    const supabase = createServiceClient();

    const { data: owners } = await supabase
      .from("admin_profiles")
      .select("id")
      .eq("role", "owner")
      .eq("is_active", true);

    if (owners?.length === 1 && owners[0].id === id && role !== "owner") {
      return NextResponse.json(
        { error: "Cannot demote the last owner" },
        { status: 400 }
      );
    }

    await supabase.from("admin_profiles").update({ role }).eq("id", id);
    await logAudit(user.id, "admin_role_changed", "admin_profile", id, { role });

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: message }, { status: 403 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { user } = await requireAdmin("owner");
    const { id } = await request.json();
    const supabase = createServiceClient();

    const { data: target } = await supabase
      .from("admin_profiles")
      .select("role")
      .eq("id", id)
      .single();

    if (target?.role === "owner") {
      const { count } = await supabase
        .from("admin_profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "owner")
        .eq("is_active", true);

      if ((count ?? 0) <= 1) {
        return NextResponse.json(
          { error: "Cannot deactivate the last owner" },
          { status: 400 }
        );
      }
    }

    await supabase
      .from("admin_profiles")
      .update({ is_active: false })
      .eq("id", id);

    await logAudit(user.id, "admin_deactivated", "admin_profile", id);

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: message }, { status: 403 });
  }
}
