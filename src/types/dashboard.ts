/** Pawlings holder dashboard domain types. */

export type GrowthStage = 1 | 2 | 3;

export interface Pawling {
  id: string;
  tokenId: string;
  name: string;
  image: string;
  rarity?: string;
  personality?: string;
  growthStage: GrowthStage;
  hunger: number;
  happiness: number;
  bond: number;
  xp: number;
  level: number;
  lastFedAt: string | null;
  lastPlayedAt: string | null;
}

export interface HolderProfile {
  walletAddress: string;
  treats: number;
}

export interface ActivityEntry {
  id: string;
  activityType: string;
  pawlingTokenId: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  label: string;
  detail?: string;
}

export interface DailyCareTaskState {
  id: string;
  label: string;
  completed: boolean;
  rewardTreats: number;
  rewardXp: number;
}

export interface MissionState {
  id: string;
  title: string;
  description: string;
  reward: number;
  completed: boolean;
  periodKey: string;
  url: string;
  confirmDelayMs: number;
}

export interface DashboardState {
  profile: HolderProfile;
  pawlings: Pawling[];
  selectedTokenId: string | null;
  activities: ActivityEntry[];
  dailyCare: DailyCareTaskState[];
  missions: MissionState[];
  achievements: { id: string; label: string; emoji: string; unlocked: boolean }[];
  demoMode: {
    forceEmpty: boolean;
    previewAuthorized: boolean;
  };
  config: {
    feedCost: number;
    feedCooldownMinutes: number;
    playCooldownMinutes: number;
    growthStageThresholds: Record<GrowthStage, number>;
  };
}

export interface FeedResult {
  pawling: Pawling;
  treats: number;
  message: string;
}

export interface PlayResult {
  pawling: Pawling;
  message: string;
  cooldownUntil: string | null;
}
