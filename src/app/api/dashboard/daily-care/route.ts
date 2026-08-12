import { NextResponse } from "next/server";
import { hasPreviewDashboardAccess } from "@/lib/dashboard/access";
import { claimDailyCheckIn } from "@/lib/dashboard/service";
import { isValidWalletAddress } from "@/lib/wallet";

export async function POST(request: Request) {
  if (!(await hasPreviewDashboardAccess())) {
    return NextResponse.json({ error: "Dashboard locked." }, { status: 403 });
  }

  const body = (await request.json()) as { wallet?: string; taskId?: string };
  if (!body.wallet || !isValidWalletAddress(body.wallet)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (body.taskId && body.taskId !== "check_in") {
    return NextResponse.json({ error: "Unsupported task." }, { status: 400 });
  }

  try {
    const result = await claimDailyCheckIn(body.wallet);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Check-in failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
