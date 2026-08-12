/**
 * Pawlings holder dashboard — feature flags and gameplay constants.
 * Keep reward/cooldown values here, not scattered in UI or API handlers.
 */

export const dashboardConfig = {
  /** When true, /dashboard is public. When false, preview gate applies. */
  live: process.env.PAWLINGS_DASHBOARD_LIVE === "true",

  /** Use mock ownership until on-chain provider is wired post-mint. */
  mockOwnershipEnabled: process.env.PAWLINGS_MOCK_OWNERSHIP !== "false",

  preview: {
    cookieName: "pawlings_dashboard_preview",
    cookieMaxAgeSeconds: 60 * 60 * 24 * 7,
  },

  treats: {
    initialBalance: 175,
    feedCost: 5,
    demoGrantAmount: 100,
  },

  feed: {
    cooldownMinutes: 15,
    hungerIncrease: 28,
    happinessIncrease: 4,
    bondIncrease: 2,
    xpIncrease: 8,
  },

  play: {
    cooldownMinutes: 30,
    happinessIncrease: 8,
    bondIncrease: 4,
    xpIncrease: 12,
  },

  decay: {
    /** Hunger lost per hour since last feed (lazy calculation on load). */
    hungerPerHour: 2,
    /** Happiness lost per hour without play. */
    happinessPerHour: 1,
    minStat: 15,
  },

  growth: {
    stages: [1, 2, 3] as const,
    xpPerLevel: 100,
    stageThresholds: {
      1: 0,
      2: 250,
      3: 600,
    } as Record<1 | 2 | 3, number>,
  },

  dailyCare: {
    period: "daily" as const,
    tasks: [
      { id: "feed", label: "Feed your Pawling", rewardTreats: 10, rewardXp: 5 },
      { id: "play", label: "Play with your Pawling", rewardTreats: 10, rewardXp: 5 },
      { id: "check_in", label: "Check in today", rewardTreats: 15, rewardXp: 0 },
      {
        id: "community",
        label: "Complete one community activity",
        rewardTreats: 20,
        rewardXp: 10,
      },
    ],
  },

  missions: {
    confirmDelayMs: 8000,
    items: [
      {
        id: "follow",
        title: "Follow Pawlings",
        description: "Join the pack on X.",
        reward: 25,
        period: "one_time" as const,
        urlKey: "profile" as const,
      },
      {
        id: "like_post",
        title: "Like Today's Post",
        description: "Show some love on our latest update.",
        reward: 10,
        period: "daily" as const,
        urlKey: "profile" as const,
      },
      {
        id: "repost",
        title: "Repost Today's Post",
        description: "Spread the word with a repost.",
        reward: 20,
        period: "daily" as const,
        urlKey: "profile" as const,
      },
      {
        id: "share_pawling",
        title: "Share Your Pawling",
        description: "Tell the world about your pup.",
        reward: 15,
        period: "daily" as const,
        urlKey: "share" as const,
      },
    ],
  },

  achievements: [
    { id: "first_feed", label: "First Feed", emoji: "🍖", locked: false },
    { id: "streak_7", label: "7 Day Streak", emoji: "🔥", locked: true },
    { id: "pack_member", label: "Pack Member", emoji: "🐾", locked: false },
    { id: "best_friends", label: "Best Friends", emoji: "💛", locked: true },
    { id: "social_pup", label: "Social Pup", emoji: "🐦", locked: true },
  ] as const,

  /** Known wallet that always shows empty ownership (preview testing). */
  emptyWalletNormalized: "0x0000000000000000000000000000000000000001",

  /** Fixed demo wallet used when skipping MetaMask in preview mode. */
  previewDemoWallet: "0x742D35CC6634c0532925A3b844BC9E7595F0BEb0",
} as const;

export type DashboardMission = (typeof dashboardConfig.missions.items)[number];
export type DailyCareTask = (typeof dashboardConfig.dailyCare.tasks)[number];
