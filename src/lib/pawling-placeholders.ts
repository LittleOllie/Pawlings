import type {
  EvolutionMilestone,
  PawlingCompanion,
  PawlingNotification,
  TimelineEvent,
} from "@/types/pawling";

/** Demo companion — replace with on-chain metadata lookup. */
export const DEMO_PAWLING: PawlingCompanion = {
  tokenId: "0042",
  name: "Blaze Jr.",
  imageUrl: "/branding/Dog1Transparent.png",
  ageDays: 12,
  stage: "puppy",
  stageLabel: "🐶 Puppy",
  stats: {
    happiness: 82,
    energy: 68,
    hunger: 91,
    growth: 54,
  },
};

export const EVOLUTION_MILESTONES: EvolutionMilestone[] = [
  {
    id: "egg",
    label: "Egg",
    emoji: "🥚",
    description: "A little mystery waiting to hatch.",
  },
  {
    id: "puppy",
    label: "Puppy",
    emoji: "🐶",
    description: "Curious, playful, and ready for care.",
  },
  {
    id: "growing",
    label: "Growing",
    emoji: "✨",
    description: "Personality blooming with every day.",
  },
  {
    id: "adult",
    label: "Adult",
    emoji: "🐕",
    description: "A legendary companion fully evolved.",
  },
];

export const DEMO_NOTIFICATIONS: PawlingNotification[] = [
  {
    id: "1",
    title: "Welcome to the nursery",
    body: "Your puppy is settling in. Care actions unlock after mint.",
    timestamp: "Just now",
  },
  {
    id: "2",
    title: "Evolution path unlocked",
    body: "Keep caring for your Pawling to watch them grow.",
    timestamp: "Coming soon",
    read: true,
  },
];

export const DEMO_TIMELINE: TimelineEvent[] = [
  {
    id: "adopt",
    title: "Adoption papers signed",
    description: "Your application entered the waiting room.",
    date: "Today",
    status: "complete",
  },
  {
    id: "mint",
    title: "Mint your puppy",
    description: "Bring your Pawling Puppy on-chain.",
    date: "Next",
    status: "current",
  },
  {
    id: "care",
    title: "Daily care begins",
    description: "Feed, play, and nurture your companion.",
    date: "Soon",
    status: "upcoming",
  },
  {
    id: "evolve",
    title: "Evolution",
    description: "Watch your puppy become a legendary adult.",
    date: "Future",
    status: "upcoming",
  },
];
