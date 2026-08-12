/**
 * Development seed script — creates fake applications, tags, and approved wallets.
 * Requires SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL in .env.local
 *
 * Usage: npm run db:seed
 */

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing Supabase credentials. Set env vars in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key);

const STATUSES = [
  "pending",
  "reviewing",
  "approved",
  "waitlisted",
  "rejected",
] as const;

const ANSWERS = [
  "I believe in the vision of building something meaningful together.",
  "As a long-time NFT collector, I connect deeply with community-driven projects.",
  "I'm a developer who wants to contribute to the ecosystem from day one.",
  "The art direction speaks to me and I want to be part of this journey.",
  "I've been following Web3 projects for years and this one stands out.",
];

function fakeWallet(index: number): string {
  const hex = index.toString(16).padStart(40, "0");
  return `0x${hex.slice(0, 40)}`;
}

function refCode(index: number): string {
  return `PAW-SEED${String(index).padStart(4, "0")}`;
}

async function seed() {
  console.log("Seeding development data...");

  const apps = [];
  for (let i = 1; i <= 30; i++) {
    const wallet = fakeWallet(i);
    apps.push({
      reference_code: refCode(i),
      wallet_address: wallet,
      wallet_address_normalized: wallet.toLowerCase(),
      x_handle: i % 3 === 0 ? `@fakeuser${i}` : null,
      x_handle_normalized: i % 3 === 0 ? `fakeuser${i}` : null,
      discord_username: i % 4 === 0 ? `discord_user_${i}` : null,
      referral_source: ["x", "discord", "friend", "community", "other"][i % 5],
      application_answer: ANSWERS[i % ANSWERS.length],
      signature_data: null,
      status: STATUSES[i % STATUSES.length],
      consent_wallet_owner: true,
      consent_no_guarantee: true,
      privacy_consent: true,
      submission_source: "seed",
    });
  }

  const { error: appError } = await supabase.from("applications").upsert(apps, {
    onConflict: "reference_code",
  });

  if (appError) {
    console.error("Application seed error:", appError.message);
  } else {
    console.log(`Seeded ${apps.length} applications`);
  }

  const approved = [];
  for (let i = 1; i <= 8; i++) {
    const wallet = fakeWallet(100 + i);
    approved.push({
      wallet_address: wallet,
      wallet_address_normalized: wallet.toLowerCase(),
      source: "seed",
      allocation_type: i % 2 === 0 ? "OG" : "Standard",
      allocation_amount: 1,
      notes: "Seed data — remove before production",
    });
  }

  const { error: walletError } = await supabase
    .from("approved_wallets")
    .upsert(approved, { onConflict: "wallet_address_normalized" });

  if (walletError) {
    console.error("Approved wallet seed error:", walletError.message);
  } else {
    console.log(`Seeded ${approved.length} approved wallets`);
  }

  console.log("Seed complete.");
}

seed().catch(console.error);
