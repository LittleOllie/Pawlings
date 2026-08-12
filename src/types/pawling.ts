/** Future-ready Pawlings companion types (placeholder data today). */

export type EvolutionStage = "egg" | "puppy" | "growing" | "adult";

export type PawlingStageLabel = "🐶 Puppy" | "🐕 Adult" | "🥚 Egg" | "✨ Growing";

export interface PawlingStats {
  happiness: number;
  energy: number;
  hunger: number;
  growth: number;
}

export interface PawlingCompanion {
  tokenId: string;
  name: string;
  imageUrl: string;
  ageDays: number;
  stage: EvolutionStage;
  stageLabel: PawlingStageLabel;
  stats: PawlingStats;
}

export interface EvolutionMilestone {
  id: EvolutionStage;
  label: string;
  emoji: string;
  description: string;
}

export interface PawlingNotification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  read?: boolean;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  status: "complete" | "current" | "upcoming";
}
