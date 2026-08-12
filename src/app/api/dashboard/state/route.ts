import { NextResponse } from "next/server";
import { hasPreviewDashboardAccess } from "@/lib/dashboard/access";
import { loadDashboardState } from "@/lib/dashboard/service";
import { isValidWalletAddress } from "@/lib/wallet";

export async function GET(request: Request) {
  const authorized = await hasPreviewDashboardAccess();
  if (!authorized) {
    return NextResponse.json({ error: "Dashboard locked." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const wallet = searchParams.get("wallet");
  const selected = searchParams.get("selected");

  if (!wallet || !isValidWalletAddress(wallet)) {
    return NextResponse.json({ error: "Valid wallet required." }, { status: 400 });
  }

  try {
    const state = await loadDashboardState(wallet, selected, authorized);
    return NextResponse.json(state);
  } catch (error) {
    console.error("Dashboard state error:", error);
    return NextResponse.json(
      { error: "We couldn't load your Pawlings right now." },
      { status: 500 }
    );
  }
}
