/**
 * Remove development seed data.
 * Usage: npm run db:seed:clean
 */

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing Supabase credentials.");
  process.exit(1);
}

const supabase = createClient(url, key);

async function clean() {
  console.log("Removing seed data...");

  const { error: appError } = await supabase
    .from("applications")
    .delete()
    .eq("submission_source", "seed");

  if (appError) console.error("App clean error:", appError.message);
  else console.log("Removed seed applications");

  const { error: walletError } = await supabase
    .from("approved_wallets")
    .delete()
    .eq("source", "seed");

  if (walletError) console.error("Wallet clean error:", walletError.message);
  else console.log("Removed seed approved wallets");

  console.log("Clean complete.");
}

clean().catch(console.error);
