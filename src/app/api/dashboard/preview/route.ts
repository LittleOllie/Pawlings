import { NextResponse } from "next/server";
import { dashboardConfig } from "@/config/dashboard-config";
import {
  createPreviewSessionToken,
  hasPreviewDashboardAccess,
} from "@/lib/dashboard/access";

export async function POST(request: Request) {
  if (dashboardConfig.live) {
    return NextResponse.json({ ok: true, live: true });
  }

  const body = (await request.json()) as { password?: string };
  const expected = process.env.PAWLINGS_DASHBOARD_PREVIEW_PASSWORD;

  if (!expected) {
    return NextResponse.json(
      { error: "Preview access is not configured." },
      { status: 503 }
    );
  }

  if (body.password !== expected) {
    return NextResponse.json({ error: "Incorrect preview password." }, { status: 401 });
  }

  const token = createPreviewSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(dashboardConfig.preview.cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: dashboardConfig.preview.cookieMaxAgeSeconds,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(dashboardConfig.preview.cookieName, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}

export async function GET() {
  const authorized = await hasPreviewDashboardAccess();
  return NextResponse.json({ authorized, live: dashboardConfig.live });
}
