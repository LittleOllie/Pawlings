import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { getSiteSettingsAdmin } from "@/lib/settings";
import { getApplicationAvailability } from "@/lib/application-status";
import { simpleApplicationSchema } from "@/lib/validation";
import {
  normalizeWalletAddress,
  formatWalletForDisplay,
  isValidWalletAddress,
} from "@/lib/wallet";
import { normalizeXHandle } from "@/lib/x-handle";
import { normalizeDiscordUsername } from "@/lib/discord-handle";
import { allocateApplicationReferenceCode } from "@/lib/application-reference";
import { checkRateLimit, hashIdentifier, verifyTurnstile } from "@/lib/rate-limit";
import { pawlingsContent } from "@/config/pawlings-content";

function getMissingSupabaseEnv(): string | null {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()) {
    return "NEXT_PUBLIC_SUPABASE_URL";
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) {
    return "SUPABASE_SERVICE_ROLE_KEY";
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const missingEnv = getMissingSupabaseEnv();
    if (missingEnv) {
      console.error(
        `[applications/submit] Missing server env: ${missingEnv}. Add it in Vercel → Settings → Environment Variables, then redeploy.`
      );
      return NextResponse.json(
        { error: "An unexpected error occurred. Please try again." },
        { status: 503 }
      );
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";
    const rateKey = hashIdentifier(ip);
    const rateCheck = checkRateLimit(rateKey);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();

    if (body.honeypot) {
      return NextResponse.json({ success: true, referenceCode: "PAW-FAKE00" });
    }

    if (process.env.TURNSTILE_SECRET_KEY && body.turnstileToken) {
      const valid = await verifyTurnstile(body.turnstileToken, ip);
      if (!valid) {
        return NextResponse.json(
          { error: "Verification failed. Please try again." },
          { status: 400 }
        );
      }
    }

    const settings = await getSiteSettingsAdmin();
    const supabase = createServiceClient();

    const { count } = await supabase
      .from("applications")
      .select("*", { count: "exact", head: true })
      .is("archived_at", null);

    const availability = getApplicationAvailability(settings, count ?? 0);
    if (!availability.canSubmit) {
      return NextResponse.json(
        { error: availability.message },
        { status: 403 }
      );
    }

    const parsed = simpleApplicationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Validation failed" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const normalizedWallet = normalizeWalletAddress(data.walletAddress);

    if (!isValidWalletAddress(data.walletAddress)) {
      return NextResponse.json(
        { error: "Invalid wallet address" },
        { status: 400 }
      );
    }

    if (!settings.allow_duplicate_wallets) {
      const { data: existing } = await supabase
        .from("applications")
        .select("id")
        .eq("wallet_address_normalized", normalizedWallet)
        .is("archived_at", null)
        .neq("status", "archived")
        .maybeSingle();

      if (existing) {
        return NextResponse.json(
          {
            error: "duplicate",
            message: pawlingsContent.adoption.duplicateWalletMessage,
          },
          { status: 409 }
        );
      }
    }

    const referenceCode = await allocateApplicationReferenceCode();
    const xNormalized = data.xHandle?.trim()
      ? normalizeXHandle(data.xHandle)
      : null;
    const discordNormalized = data.discordUsername?.trim()
      ? normalizeDiscordUsername(data.discordUsername)
      : null;

    const applicationAnswer =
      data.applicationAnswer?.trim() || "No additional statement provided.";

    const { data: application, error } = await supabase
      .from("applications")
      .insert({
        reference_code: referenceCode,
        wallet_address: formatWalletForDisplay(data.walletAddress),
        wallet_address_normalized: normalizedWallet,
        x_handle: xNormalized ? `@${xNormalized}` : null,
        x_handle_normalized: xNormalized,
        discord_username: discordNormalized,
        application_answer: applicationAnswer,
        signature_data: data.signatureDataUrl ?? null,
        status: "pending",
        submission_source: "web",
        submission_ip_hash: rateKey,
      })
      .select("reference_code")
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          {
            error: "duplicate",
            message: pawlingsContent.adoption.duplicateWalletMessage,
          },
          { status: 409 }
        );
      }
      console.error("Application insert error:", error);
      return NextResponse.json(
        { error: "Failed to submit application. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      referenceCode: application.reference_code,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Application submission error:", message, err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
