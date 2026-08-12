import { cookies } from "next/headers";
import { dashboardConfig } from "@/config/dashboard-config";
import {
  applyCareDecay,
  applyFeed,
  applyPlay,
  canFeed,
  canPlay,
  missionPeriodKey,
  todayPeriodKey,
} from "@/lib/dashboard/care";
import { createOwnershipProvider } from "@/lib/dashboard/ownership";
import { createMissionVerifier } from "@/lib/dashboard/missions/verifier";
import { createServiceClient } from "@/lib/supabase/admin";
import { isValidWalletAddress, normalizeWalletAddress } from "@/lib/wallet";
import type {
  ActivityEntry,
  DashboardState,
  DailyCareTaskState,
  FeedResult,
  MissionState,
  Pawling,
  PlayResult,
} from "@/types/dashboard";
import type { Json } from "@/types/supabase";

const DEMO_COOKIE = "pawlings_dashboard_demo";

export interface DemoModeFlags {
  forceEmpty: boolean;
  forceCount: number | null;
}

export async function getDemoModeFlags(): Promise<DemoModeFlags> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(DEMO_COOKIE)?.value;
  if (!raw) return { forceEmpty: false, forceCount: null };
  try {
    const parsed = JSON.parse(Buffer.from(raw, "base64url").toString("utf8")) as DemoModeFlags;
    return {
      forceEmpty: Boolean(parsed.forceEmpty),
      forceCount: typeof parsed.forceCount === "number" ? parsed.forceCount : null,
    };
  } catch {
    return { forceEmpty: false, forceCount: null };
  }
}

export function demoModeCookieValue(flags: DemoModeFlags): string {
  return Buffer.from(JSON.stringify(flags)).toString("base64url");
}

function assertWallet(walletAddress: string): string {
  if (!isValidWalletAddress(walletAddress)) {
    throw new Error("Invalid wallet address");
  }
  return normalizeWalletAddress(walletAddress);
}

function formatActivity(entry: {
  id: string;
  activity_type: string;
  pawling_token_id: string | null;
  metadata: Json;
  created_at: string;
}): ActivityEntry {
  const meta = (entry.metadata ?? {}) as Record<string, unknown>;
  let label = "Activity";
  let detail: string | undefined;

  switch (entry.activity_type) {
    case "feed":
      label = `🍖 Fed ${meta.name ?? "Pawling"}`;
      detail = meta.detail as string | undefined;
      break;
    case "play":
      label = `🎾 Played with ${meta.name ?? "Pawling"}`;
      detail = meta.detail as string | undefined;
      break;
    case "mission":
      label = "🐦 Completed Pack Mission";
      detail = meta.detail as string | undefined;
      break;
    case "daily_care":
      label = "✨ Daily care complete";
      detail = meta.detail as string | undefined;
      break;
    case "demo":
      label = "🛠 Demo update";
      detail = meta.detail as string | undefined;
      break;
    default:
      label = entry.activity_type;
  }

  return {
    id: entry.id,
    activityType: entry.activity_type,
    pawlingTokenId: entry.pawling_token_id,
    metadata: meta,
    createdAt: entry.created_at,
    label,
    detail,
  };
}

async function ensureHolderProfile(wallet: string) {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("holder_profiles")
    .select("*")
    .eq("wallet_address_normalized", wallet)
    .maybeSingle();

  if (data) return data;

  const { data: created, error } = await supabase
    .from("holder_profiles")
    .insert({
      wallet_address: wallet,
      wallet_address_normalized: wallet,
      treats: dashboardConfig.treats.initialBalance,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return created;
}

async function loadCareStates(wallet: string, tokenIds: string[]) {
  if (tokenIds.length === 0) return new Map<string, Pawling>();
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("pawling_care_state")
    .select("*")
    .eq("wallet_address_normalized", wallet)
    .in("pawling_token_id", tokenIds);

  const map = new Map<string, Pawling>();
  for (const row of data ?? []) {
    map.set(row.pawling_token_id, {
      id: `${wallet}-${row.pawling_token_id}`,
      tokenId: row.pawling_token_id,
      name: "",
      image: "",
      growthStage: row.growth_stage as 1 | 2 | 3,
      hunger: row.hunger,
      happiness: row.happiness,
      bond: row.bond,
      xp: row.xp,
      level: row.level,
      lastFedAt: row.last_fed_at,
      lastPlayedAt: row.last_played_at,
    });
  }
  return map;
}

async function upsertCareState(wallet: string, pawling: Pawling) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("pawling_care_state").upsert(
    {
      wallet_address_normalized: wallet,
      pawling_token_id: pawling.tokenId,
      hunger: pawling.hunger,
      happiness: pawling.happiness,
      bond: pawling.bond,
      xp: pawling.xp,
      level: pawling.level,
      growth_stage: pawling.growthStage,
      last_fed_at: pawling.lastFedAt,
      last_played_at: pawling.lastPlayedAt,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "wallet_address_normalized,pawling_token_id" }
  );
  if (error) throw new Error(error.message);
}

async function logActivity(
  wallet: string,
  activityType: string,
  tokenId: string | null,
  metadata: Record<string, unknown>
) {
  const supabase = createServiceClient();
  await supabase.from("pawling_activity").insert({
    wallet_address_normalized: wallet,
    pawling_token_id: tokenId,
    activity_type: activityType,
    metadata: metadata as Json,
  });
}

async function mergeOwnershipWithCare(
  wallet: string,
  demo: DemoModeFlags
): Promise<Pawling[]> {
  const provider = createOwnershipProvider();
  const owned = await provider.getPawlingsForWallet(wallet, {
    forceEmpty: demo.forceEmpty,
    forceCount: demo.forceCount ?? undefined,
  });

  const careMap = await loadCareStates(
    wallet,
    owned.map((p) => p.tokenId)
  );

  return owned.map((base) => {
    const stored = careMap.get(base.tokenId);
    const merged = stored
      ? { ...base, ...stored, name: base.name, image: base.image, personality: base.personality, rarity: base.rarity }
      : base;
    return applyCareDecay(merged);
  });
}

export async function loadDashboardState(
  walletAddress: string,
  selectedTokenId?: string | null,
  previewAuthorized = false
): Promise<DashboardState> {
  const wallet = assertWallet(walletAddress);
  const demo = await getDemoModeFlags();
  const profileRow = await ensureHolderProfile(wallet);
  const pawlings = await mergeOwnershipWithCare(wallet, demo);

  const supabase = createServiceClient();
  const period = todayPeriodKey();

  const [{ data: activities }, { data: dailyRows }, { data: missionRows }] =
    await Promise.all([
      supabase
        .from("pawling_activity")
        .select("*")
        .eq("wallet_address_normalized", wallet)
        .order("created_at", { ascending: false })
        .limit(8),
      supabase
        .from("daily_care_completions")
        .select("task_id")
        .eq("wallet_address_normalized", wallet)
        .eq("period_key", period),
      supabase
        .from("social_mission_completions")
        .select("mission_id, period_key")
        .eq("wallet_address_normalized", wallet),
    ]);

  const completedDaily = new Set((dailyRows ?? []).map((r) => r.task_id));
  const completedMissions = new Set(
    (missionRows ?? []).map((r) => `${r.mission_id}:${r.period_key}`)
  );

  const dailyCare: DailyCareTaskState[] = dashboardConfig.dailyCare.tasks.map((task) => ({
    id: task.id,
    label: task.label,
    completed: completedDaily.has(task.id),
    rewardTreats: task.rewardTreats,
    rewardXp: task.rewardXp,
  }));

  const xUrl = process.env.NEXT_PUBLIC_PAWLINGS_X_URL ?? "https://x.com/Pawlings";

  const missions: MissionState[] = dashboardConfig.missions.items.map((m) => {
    const pKey = missionPeriodKey(m.period);
    return {
      id: m.id,
      title: m.title,
      description: m.description,
      reward: m.reward,
      completed: completedMissions.has(`${m.id}:${pKey}`),
      periodKey: pKey,
      url: m.urlKey === "share" ? xUrl : xUrl,
      confirmDelayMs: dashboardConfig.missions.confirmDelayMs,
    };
  });

  const selected =
    selectedTokenId && pawlings.some((p) => p.tokenId === selectedTokenId)
      ? selectedTokenId
      : pawlings[0]?.tokenId ?? null;

  const feedCount = (activities ?? []).some((a) => a.activity_type === "feed");
  const missionCount = (missionRows ?? []).length;

  return {
    profile: {
      walletAddress: wallet,
      treats: profileRow.treats,
    },
    pawlings,
    selectedTokenId: selected,
    activities: (activities ?? []).map(formatActivity),
    dailyCare,
    missions,
    achievements: dashboardConfig.achievements.map((a) => {
      const achievement = a as { id: string; label: string; emoji: string; locked: boolean };
      let unlocked = !achievement.locked;
      if (!achievement.locked) {
        if (achievement.id === "first_feed") unlocked = feedCount;
        else if (achievement.id === "pack_member") unlocked = pawlings.length > 0;
        else if (achievement.id === "social_pup") unlocked = missionCount > 0;
      }
      return {
        id: achievement.id,
        label: achievement.label,
        emoji: achievement.emoji,
        unlocked,
      };
    }),
    demoMode: {
      forceEmpty: demo.forceEmpty,
      previewAuthorized,
    },
    config: {
      feedCost: dashboardConfig.treats.feedCost,
      feedCooldownMinutes: dashboardConfig.feed.cooldownMinutes,
      playCooldownMinutes: dashboardConfig.play.cooldownMinutes,
      growthStageThresholds: dashboardConfig.growth.stageThresholds,
    },
  };
}

export async function feedPawling(
  walletAddress: string,
  tokenId: string
): Promise<FeedResult> {
  const wallet = assertWallet(walletAddress);
  const demo = await getDemoModeFlags();
  const pawlings = await mergeOwnershipWithCare(wallet, demo);
  const pawling = pawlings.find((p) => p.tokenId === tokenId);
  if (!pawling) throw new Error("Pawling not found");

  const feedCheck = canFeed(pawling);
  if (!feedCheck.ok) {
    throw new Error(
      feedCheck.reason === "full"
        ? `That Pawling is still full from their last meal. Try again in ${feedCheck.minutesLeft}m.`
        : "Cannot feed right now."
    );
  }

  const profile = await ensureHolderProfile(wallet);
  if (profile.treats < dashboardConfig.treats.feedCost) {
    throw new Error("Not enough Treats. Complete missions or daily care to earn more.");
  }

  const updated = applyFeed(pawling);
  const supabase = createServiceClient();

  const { error: treatError } = await supabase
    .from("holder_profiles")
    .update({
      treats: profile.treats - dashboardConfig.treats.feedCost,
      updated_at: new Date().toISOString(),
    })
    .eq("wallet_address_normalized", wallet)
    .gte("treats", dashboardConfig.treats.feedCost);

  if (treatError) throw new Error("Could not deduct Treats.");

  await upsertCareState(wallet, updated);
  await logActivity(wallet, "feed", tokenId, {
    name: pawling.name,
    detail: `+${dashboardConfig.feed.happinessIncrease} Happiness`,
  });

  await maybeCompleteDailyTask(wallet, "feed", tokenId);

  return {
    pawling: updated,
    treats: profile.treats - dashboardConfig.treats.feedCost,
    message: `${pawling.name} enjoyed their meal! 🍖`,
  };
}

export async function playWithPawling(
  walletAddress: string,
  tokenId: string
): Promise<PlayResult> {
  const wallet = assertWallet(walletAddress);
  const demo = await getDemoModeFlags();
  const pawlings = await mergeOwnershipWithCare(wallet, demo);
  const pawling = pawlings.find((p) => p.tokenId === tokenId);
  if (!pawling) throw new Error("Pawling not found");

  const playCheck = canPlay(pawling);
  if (!playCheck.ok) {
    throw new Error(`Ready to play again in ${playCheck.minutesLeft}m`);
  }

  const updated = applyPlay(pawling);
  await upsertCareState(wallet, updated);
  await logActivity(wallet, "play", tokenId, {
    name: pawling.name,
    detail: `+${dashboardConfig.play.happinessIncrease} Happiness • +${dashboardConfig.play.bondIncrease} Bond`,
  });

  await maybeCompleteDailyTask(wallet, "play", tokenId);

  return {
    pawling: updated,
    message: `${pawling.name} had a great time!`,
    cooldownUntil: updated.lastPlayedAt,
  };
}

async function maybeCompleteDailyTask(
  wallet: string,
  taskId: string,
  tokenId: string
) {
  const task = dashboardConfig.dailyCare.tasks.find((t) => t.id === taskId);
  if (!task) return;

  const period = todayPeriodKey();
  const supabase = createServiceClient();

  const { data: existing } = await supabase
    .from("daily_care_completions")
    .select("id")
    .eq("wallet_address_normalized", wallet)
    .eq("task_id", taskId)
    .eq("period_key", period)
    .maybeSingle();

  if (existing) return;

  await supabase.from("daily_care_completions").insert({
    wallet_address_normalized: wallet,
    task_id: taskId,
    period_key: period,
    reward_treats: task.rewardTreats,
    reward_xp: task.rewardXp,
  });

  if (task.rewardTreats > 0) {
    const profile = await ensureHolderProfile(wallet);
    await supabase
      .from("holder_profiles")
      .update({
        treats: profile.treats + task.rewardTreats,
        updated_at: new Date().toISOString(),
      })
      .eq("wallet_address_normalized", wallet);
  }

  if (task.rewardXp > 0) {
    const demo = await getDemoModeFlags();
    const pawlings = await mergeOwnershipWithCare(wallet, demo);
    const pawling = pawlings.find((p) => p.tokenId === tokenId);
    if (pawling) {
      const xp = pawling.xp + task.rewardXp;
      await upsertCareState(wallet, {
        ...pawling,
        xp,
        level: 1 + Math.floor(xp / dashboardConfig.growth.xpPerLevel),
        growthStage: xp >= dashboardConfig.growth.stageThresholds[3] ? 3 : xp >= dashboardConfig.growth.stageThresholds[2] ? 2 : 1,
      });
    }
  }
}

export async function completeMission(
  walletAddress: string,
  missionId: string
): Promise<{ treats: number; reward: number }> {
  const wallet = assertWallet(walletAddress);
  const mission = dashboardConfig.missions.items.find((m) => m.id === missionId);
  if (!mission) throw new Error("Mission not found");

  const periodKey = missionPeriodKey(mission.period);
  const supabase = createServiceClient();

  const { data: existing } = await supabase
    .from("social_mission_completions")
    .select("id")
    .eq("wallet_address_normalized", wallet)
    .eq("mission_id", missionId)
    .eq("period_key", periodKey)
    .maybeSingle();

  if (existing) throw new Error("Mission already completed for this period.");

  const verifier = createMissionVerifier();
  const result = await verifier.verify(missionId, wallet);
  if (!result.verified) throw new Error(result.message ?? "Verification failed.");

  const profile = await ensureHolderProfile(wallet);
  const reward = mission.reward;

  const { error } = await supabase.from("social_mission_completions").insert({
    wallet_address_normalized: wallet,
    mission_id: missionId,
    period_key: periodKey,
    reward,
  });

  if (error) throw new Error("Could not record mission completion.");

  await supabase
    .from("holder_profiles")
    .update({
      treats: profile.treats + reward,
      updated_at: new Date().toISOString(),
    })
    .eq("wallet_address_normalized", wallet);

  await logActivity(wallet, "mission", null, {
    detail: `+${reward} Treats`,
    missionId,
  });

  await maybeCompleteDailyTask(wallet, "community", "");

  return { treats: profile.treats + reward, reward };
}

export async function claimDailyCheckIn(walletAddress: string): Promise<{ treats: number }> {
  const wallet = assertWallet(walletAddress);
  const task = dashboardConfig.dailyCare.tasks.find((t) => t.id === "check_in");
  if (!task) throw new Error("Task not found");

  const period = todayPeriodKey();
  const supabase = createServiceClient();

  const { data: existing } = await supabase
    .from("daily_care_completions")
    .select("id")
    .eq("wallet_address_normalized", wallet)
    .eq("task_id", "check_in")
    .eq("period_key", period)
    .maybeSingle();

  if (existing) throw new Error("Already checked in today.");

  const profile = await ensureHolderProfile(wallet);

  await supabase.from("daily_care_completions").insert({
    wallet_address_normalized: wallet,
    task_id: "check_in",
    period_key: period,
    reward_treats: task.rewardTreats,
    reward_xp: 0,
  });

  await supabase
    .from("holder_profiles")
    .update({
      treats: profile.treats + task.rewardTreats,
      updated_at: new Date().toISOString(),
    })
    .eq("wallet_address_normalized", wallet);

  await logActivity(wallet, "daily_care", null, {
    detail: `+${task.rewardTreats} Treats`,
  });

  return { treats: profile.treats + task.rewardTreats };
}

export async function runDemoAction(
  walletAddress: string,
  action: string
): Promise<{ message: string }> {
  const wallet = assertWallet(walletAddress);
  const supabase = createServiceClient();

  switch (action) {
    case "reset_care": {
      await supabase.from("pawling_care_state").delete().eq("wallet_address_normalized", wallet);
      await logActivity(wallet, "demo", null, { detail: "Care state reset" });
      return { message: "Care state reset." };
    }
    case "add_treats": {
      const profile = await ensureHolderProfile(wallet);
      await supabase
        .from("holder_profiles")
        .update({
          treats: profile.treats + dashboardConfig.treats.demoGrantAmount,
          updated_at: new Date().toISOString(),
        })
        .eq("wallet_address_normalized", wallet);
      return { message: `+${dashboardConfig.treats.demoGrantAmount} Treats added.` };
    }
    default:
      throw new Error("Unknown demo action.");
  }
}

/**
 * SECURITY NOTE: Wallet address is accepted from the client without SIWE today.
 * Before live launch with valuable rewards, implement Sign-In With Ethereum
 * so users cannot spoof another holder's wallet address.
 */
