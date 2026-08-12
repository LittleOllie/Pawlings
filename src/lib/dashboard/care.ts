import { dashboardConfig } from "@/config/dashboard-config";
import type { Pawling } from "@/types/dashboard";

export function clampStat(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function hoursSince(iso: string | null): number {
  if (!iso) return Infinity;
  return (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60);
}

export function minutesSince(iso: string | null): number {
  if (!iso) return Infinity;
  return (Date.now() - new Date(iso).getTime()) / (1000 * 60);
}

/** Apply lazy time-based decay without harming the Pawling permanently. */
export function applyCareDecay(pawling: Pawling): Pawling {
  const hungerHours = hoursSince(pawling.lastFedAt);
  const playHours = hoursSince(pawling.lastPlayedAt);

  let hunger = pawling.hunger;
  let happiness = pawling.happiness;

  if (Number.isFinite(hungerHours)) {
    hunger -= Math.floor(hungerHours * dashboardConfig.decay.hungerPerHour);
  }
  if (Number.isFinite(playHours)) {
    happiness -= Math.floor(playHours * dashboardConfig.decay.happinessPerHour);
  }

  hunger = Math.max(dashboardConfig.decay.minStat, hunger);
  happiness = Math.max(dashboardConfig.decay.minStat, happiness);

  return { ...pawling, hunger: clampStat(hunger), happiness: clampStat(happiness) };
}

export function getGrowthStage(xp: number): 1 | 2 | 3 {
  const { stageThresholds } = dashboardConfig.growth;
  if (xp >= stageThresholds[3]) return 3;
  if (xp >= stageThresholds[2]) return 2;
  return 1;
}

export function xpToNextStage(xp: number): { current: number; target: number; stage: 1 | 2 | 3 } {
  const stage = getGrowthStage(xp);
  if (stage === 3) {
    return { current: xp, target: xp, stage: 3 };
  }
  const nextStage = (stage + 1) as 2 | 3;
  const target = dashboardConfig.growth.stageThresholds[nextStage];
  return { current: xp, target, stage };
}

export function canFeed(pawling: Pawling): { ok: boolean; reason?: string; minutesLeft?: number } {
  const mins = minutesSince(pawling.lastFedAt);
  if (mins < dashboardConfig.feed.cooldownMinutes) {
    return {
      ok: false,
      reason: "full",
      minutesLeft: Math.ceil(dashboardConfig.feed.cooldownMinutes - mins),
    };
  }
  return { ok: true };
}

export function canPlay(pawling: Pawling): { ok: boolean; minutesLeft?: number } {
  const mins = minutesSince(pawling.lastPlayedAt);
  if (mins < dashboardConfig.play.cooldownMinutes) {
    return {
      ok: false,
      minutesLeft: Math.ceil(dashboardConfig.play.cooldownMinutes - mins),
    };
  }
  return { ok: true };
}

export function applyFeed(pawling: Pawling): Pawling {
  const now = new Date().toISOString();
  const xp = pawling.xp + dashboardConfig.feed.xpIncrease;
  const level = 1 + Math.floor(xp / dashboardConfig.growth.xpPerLevel);

  return applyCareDecay({
    ...pawling,
    hunger: clampStat(pawling.hunger + dashboardConfig.feed.hungerIncrease),
    happiness: clampStat(pawling.happiness + dashboardConfig.feed.happinessIncrease),
    bond: clampStat(pawling.bond + dashboardConfig.feed.bondIncrease),
    xp,
    level,
    growthStage: getGrowthStage(xp),
    lastFedAt: now,
  });
}

export function applyPlay(pawling: Pawling): Pawling {
  const now = new Date().toISOString();
  const xp = pawling.xp + dashboardConfig.play.xpIncrease;
  const level = 1 + Math.floor(xp / dashboardConfig.growth.xpPerLevel);

  return applyCareDecay({
    ...pawling,
    happiness: clampStat(pawling.happiness + dashboardConfig.play.happinessIncrease),
    bond: clampStat(pawling.bond + dashboardConfig.play.bondIncrease),
    xp,
    level,
    growthStage: getGrowthStage(xp),
    lastPlayedAt: now,
  });
}

export function moodLabel(pawling: Pawling): string {
  if (pawling.hunger < 35) return "Hungry";
  if (pawling.happiness < 35) return "Sleepy";
  if (pawling.bond < 35) return "Wants attention";
  if (pawling.happiness > 80) return "Beaming";
  return "Content";
}

export function todayPeriodKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function missionPeriodKey(
  period: "daily" | "weekly" | "one_time"
): string {
  if (period === "one_time") return "once";
  if (period === "weekly") {
    const d = new Date();
    const oneJan = new Date(d.getFullYear(), 0, 1);
    const week = Math.ceil(((d.getTime() - oneJan.getTime()) / 86400000 + oneJan.getDay() + 1) / 7);
    return `${d.getFullYear()}-W${week}`;
  }
  return todayPeriodKey();
}
