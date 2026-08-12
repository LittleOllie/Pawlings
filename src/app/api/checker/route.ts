import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { getSiteSettingsAdmin } from "@/lib/settings";
import { isValidWalletAddress, normalizeWalletAddress } from "@/lib/wallet";
import { checkRateLimit, hashIdentifier } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rateCheck = checkRateLimit(`checker:${hashIdentifier(ip)}`);

  if (!rateCheck.allowed) {
    return NextResponse.json({
      status: "rate_limited",
      message: "Too many checks. Please wait a moment.",
    });
  }

  const settings = await getSiteSettingsAdmin();

  if (!settings.checker_enabled) {
    return NextResponse.json({
      status: "closed",
      message: settings.checker_closed_message,
    });
  }

  const { walletAddress } = await request.json();

  if (!walletAddress || !isValidWalletAddress(walletAddress)) {
    return NextResponse.json({
      status: "invalid",
      message: "Please enter a valid Ethereum wallet address.",
    });
  }

  const normalized = normalizeWalletAddress(walletAddress);
  const supabase = createServiceClient();

  const { data } = await supabase
    .from("approved_wallets")
    .select("allocation_type, allocation_amount")
    .eq("wallet_address_normalized", normalized)
    .maybeSingle();

  if (data) {
    return NextResponse.json({
      status: "approved",
      message: settings.checker_approved_message,
      allocationType: data.allocation_type,
      allocationAmount: data.allocation_amount,
    });
  }

  return NextResponse.json({
    status: "not_found",
    message: settings.checker_not_approved_message,
  });
}
