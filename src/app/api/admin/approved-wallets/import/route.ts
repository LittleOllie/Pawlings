import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, logAudit } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase/admin";
import { parseWalletCsv } from "@/lib/csv";
import { formatWalletForDisplay, normalizeWalletAddress } from "@/lib/wallet";

export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAdmin("admin");
    const { csv, preview = true } = await request.json();

    if (!csv) {
      return NextResponse.json({ error: "CSV content required" }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { data: existing } = await supabase
      .from("approved_wallets")
      .select("wallet_address_normalized");

    const existingSet = new Set(
      (existing ?? []).map((w) => w.wallet_address_normalized)
    );

    let result;
    try {
      result = parseWalletCsv(csv, existingSet);
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "Invalid CSV" },
        { status: 400 }
      );
    }

    if (preview) {
      return NextResponse.json({
        valid: result.valid.length,
        duplicates: result.duplicates.length,
        invalid: result.invalid.length,
        invalidRows: result.invalid,
      });
    }

    const inserts = result.valid.map((row) => ({
      wallet_address: formatWalletForDisplay(row.wallet_address),
      wallet_address_normalized: normalizeWalletAddress(row.wallet_address),
      source: "csv_import",
      allocation_type: row.allocation_type ?? null,
      allocation_amount: row.allocation_amount ?? null,
      notes: row.notes ?? null,
      added_by: user.id,
    }));

    if (inserts.length > 0) {
      await supabase.from("approved_wallets").insert(inserts);
    }

    await logAudit(user.id, "csv_import", "approved_wallets", undefined, {
      imported: inserts.length,
      invalid: result.invalid.length,
    });

    return NextResponse.json({
      imported: inserts.length,
      duplicates: result.duplicates.length,
      invalid: result.invalid.length,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
