import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase/admin";
import { applicationsToCsv, APPROVED_WALLET_EXPORT_FIELDS } from "@/lib/csv";

export async function GET() {
  try {
    await requireAdmin("admin");
    const supabase = createServiceClient();
    const { data } = await supabase.from("approved_wallets").select("*");

    const csv = applicationsToCsv(
      (data ?? []) as Record<string, unknown>[],
      [...APPROVED_WALLET_EXPORT_FIELDS]
    );

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="approved-wallets.csv"',
      },
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
