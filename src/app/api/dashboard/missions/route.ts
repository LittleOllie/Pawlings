import { NextResponse } from "next/server";
import { hasPreviewDashboardAccess } from "@/lib/dashboard/access";
import { completeMission } from "@/lib/dashboard/service";
import { isValidWalletAddress } from "@/lib/wallet";

export async function POST(request: Request) {
  if (!(await hasPreviewDashboardAccess())) {
    return NextResponse.json({ error: "Dashboard locked." }, { status: 403 });
  }

  const body = (await request.json()) as { wallet?: string; missionId?: string };
  if (!body.wallet || !isValidWalletAddress(body.wallet) || !body.missionId) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    const result = await completeMission(body.wallet, body.missionId);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Mission failed.";
    const status = message.includes("already completed") ? 409 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
