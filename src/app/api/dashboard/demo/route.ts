import { NextResponse } from "next/server";
import { getDashboardAccessMode } from "@/lib/dashboard/access";
import { demoModeCookieValue, runDemoAction } from "@/lib/dashboard/service";
import { isValidWalletAddress } from "@/lib/wallet";

const DEMO_COOKIE = "pawlings_dashboard_demo";

export async function POST(request: Request) {
  const mode = await getDashboardAccessMode();
  if (mode === "locked") {
    return NextResponse.json({ error: "Dashboard locked." }, { status: 403 });
  }
  if (mode === "live") {
    return NextResponse.json({ error: "Demo controls unavailable in live mode." }, { status: 403 });
  }

  const body = (await request.json()) as {
    wallet?: string;
    action?: string;
    demoFlags?: { forceEmpty?: boolean; forceCount?: number | null };
  };

  if (body.demoFlags) {
    const response = NextResponse.json({ message: "Demo view updated." });
    response.cookies.set(
      DEMO_COOKIE,
      demoModeCookieValue({
        forceEmpty: Boolean(body.demoFlags.forceEmpty),
        forceCount:
          typeof body.demoFlags.forceCount === "number" ? body.demoFlags.forceCount : null,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24,
      }
    );
    return response;
  }

  if (!body.wallet || !isValidWalletAddress(body.wallet) || !body.action) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    const result = await runDemoAction(body.wallet, body.action);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Demo action failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE() {
  const mode = await getDashboardAccessMode();
  if (mode !== "preview") {
    return NextResponse.json({ error: "Not available." }, { status: 403 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set("pawlings_dashboard_demo", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
