import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, logAudit } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase/admin";
import {
  normalizeWalletAddress,
  formatWalletForDisplay,
  isValidWalletAddress,
} from "@/lib/wallet";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin("admin");
    const supabase = createServiceClient();
    const q = request.nextUrl.searchParams.get("q");

    let query = supabase
      .from("approved_wallets")
      .select("*")
      .order("created_at", { ascending: false });

    if (q) query = query.ilike("wallet_address", `%${q}%`);

    const { data } = await query;
    return NextResponse.json({ wallets: data ?? [] });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAdmin("admin");
    const supabase = createServiceClient();
    const { walletAddress, source = "manual", notes, allocation_type, allocation_amount } =
      await request.json();

    if (!isValidWalletAddress(walletAddress)) {
      return NextResponse.json({ error: "Invalid wallet address" }, { status: 400 });
    }

    const normalized = normalizeWalletAddress(walletAddress);
    const { error } = await supabase.from("approved_wallets").insert({
      wallet_address: formatWalletForDisplay(walletAddress),
      wallet_address_normalized: normalized,
      source,
      notes,
      allocation_type,
      allocation_amount,
      added_by: user.id,
    });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "Wallet already approved" }, { status: 409 });
      }
      throw error;
    }

    await logAudit(user.id, "approved_wallet_added", "approved_wallet", normalized);
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { user } = await requireAdmin("admin");
    const supabase = createServiceClient();
    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    await supabase.from("approved_wallets").delete().eq("id", id);
    await logAudit(user.id, "approved_wallet_removed", "approved_wallet", id);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
