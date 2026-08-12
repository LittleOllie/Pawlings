import { keccak256, toBytes } from "viem";
import { dashboardConfig } from "@/config/dashboard-config";
import type { Pawling } from "@/types/dashboard";

/** The four Meet the Pack Pawlings — same as the landing page carousel. */
export const PACK_FEATURED_CATALOG = [
  {
    tokenId: "0042",
    name: "Blaze",
    image: "/branding/Dog1Transparent.png",
    rarity: "Common",
    personality: "Bold & bright",
  },
  {
    tokenId: "0108",
    name: "Jack",
    image: "/branding/pack-jack-transparent.png?v=3",
    rarity: "Rare",
    personality: "Poolside legend",
  },
  {
    tokenId: "0231",
    name: "Lola",
    image: "/branding/pack-lola-transparent.png",
    rarity: "Uncommon",
    personality: "Flower crown energy",
  },
  {
    tokenId: "0315",
    name: "Riot",
    image: "/branding/pack-riot-transparent.png",
    rarity: "Epic",
    personality: "Chaos with style",
  },
] as const;

export function isPreviewDemoWallet(walletAddress: string): boolean {
  return (
    walletAddress.toLowerCase() === dashboardConfig.previewDemoWallet.toLowerCase()
  );
}

export function hashWallet(walletAddress: string): bigint {
  return BigInt(keccak256(toBytes(walletAddress.toLowerCase())));
}

/** Deterministic count 1–4 from wallet hash (non-preview wallets). */
export function demoPawlingCountForWallet(walletAddress: string): number {
  if (isPreviewDemoWallet(walletAddress)) {
    return PACK_FEATURED_CATALOG.length;
  }
  const hash = hashWallet(walletAddress);
  return Number((hash % BigInt(3)) + BigInt(1));
}

export function selectMockPawlingsForWallet(
  walletAddress: string,
  count: number
): (typeof PACK_FEATURED_CATALOG)[number][] {
  if (isPreviewDemoWallet(walletAddress)) {
    return [...PACK_FEATURED_CATALOG];
  }

  const normalized = walletAddress.toLowerCase();
  const hash = hashWallet(normalized);
  const catalog = [...PACK_FEATURED_CATALOG];
  const selected: (typeof PACK_FEATURED_CATALOG)[number][] = [];
  let cursor = Number(hash % BigInt(catalog.length));

  for (let i = 0; i < count && i < catalog.length; i++) {
    selected.push(catalog[cursor % catalog.length]);
    cursor += 1 + (Number(hash >> BigInt(i * 8)) % 3);
  }

  const seen = new Set<string>();
  return selected.filter((p) => {
    if (seen.has(p.tokenId)) return false;
    seen.add(p.tokenId);
    return true;
  });
}

export function createDefaultPawlingCare(
  catalogItem: (typeof PACK_FEATURED_CATALOG)[number],
  walletAddress: string
): Pawling {
  const hash = hashWallet(`${walletAddress}:${catalogItem.tokenId}`);
  const hunger = 55 + Number(hash % BigInt(25));
  const happiness = 60 + Number((hash >> BigInt(8)) % BigInt(30));
  const bond = 35 + Number((hash >> BigInt(16)) % BigInt(40));
  const xp = Number((hash >> BigInt(24)) % BigInt(180));

  return {
    id: `${walletAddress.toLowerCase()}-${catalogItem.tokenId}`,
    tokenId: catalogItem.tokenId,
    name: catalogItem.name,
    image: catalogItem.image,
    rarity: catalogItem.rarity,
    personality: catalogItem.personality,
    growthStage: 1,
    hunger,
    happiness,
    bond,
    xp,
    level: 1 + Math.floor(xp / dashboardConfig.growth.xpPerLevel),
    lastFedAt: null,
    lastPlayedAt: null,
  };
}

export function isKnownEmptyWallet(walletAddress: string): boolean {
  return walletAddress.toLowerCase() === dashboardConfig.emptyWalletNormalized;
}
