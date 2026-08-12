import { NextResponse } from "next/server";
import { hasPreviewDashboardAccess } from "@/lib/dashboard/access";
import { playWithPawling } from "@/lib/dashboard/service";
import { isValidWalletAddress } from "@/lib/wallet";

export async function POST(request: Request) {
  if (!(await hasPreviewDashboardAccess())) {
    return NextResponse.json({ error: "Dashboard locked." }, { status: 403 });
  }

  const body = (await request.json()) as { wallet?: string; tokenId?: string };
  if (!body.wallet || !isValidWalletAddress(body.wallet) || !body.tokenId) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    const result = await playWithPawling(body.wallet, body.tokenId);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Play failed.";
    const status = message.includes("Ready to play") ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
