import { describe, it, expect } from "vitest";
import {
  applyFeed,
  applyPlay,
  canFeed,
  canPlay,
  clampStat,
  getGrowthStage,
} from "@/lib/dashboard/care";
import type { Pawling } from "@/types/dashboard";

const basePawling: Pawling = {
  id: "test-0042",
  tokenId: "0042",
  name: "Blaze",
  image: "/branding/Dog1Transparent.png",
  growthStage: 1,
  hunger: 40,
  happiness: 50,
  bond: 30,
  xp: 0,
  level: 1,
  lastFedAt: null,
  lastPlayedAt: null,
};

describe("dashboard care", () => {
  it("clamps stats between 0 and 100", () => {
    expect(clampStat(150)).toBe(100);
    expect(clampStat(-5)).toBe(0);
  });

  it("feed increases hunger and xp", () => {
    const fed = applyFeed(basePawling);
    expect(fed.hunger).toBeGreaterThan(basePawling.hunger);
    expect(fed.xp).toBeGreaterThan(basePawling.xp);
    expect(fed.lastFedAt).toBeTruthy();
  });

  it("play increases happiness and bond", () => {
    const played = applyPlay(basePawling);
    expect(played.happiness).toBeGreaterThan(basePawling.happiness);
    expect(played.bond).toBeGreaterThan(basePawling.bond);
  });

  it("enforces feed cooldown", () => {
    const fed = applyFeed(basePawling);
    const check = canFeed(fed);
    expect(check.ok).toBe(false);
    expect(check.minutesLeft).toBeGreaterThan(0);
  });

  it("enforces play cooldown", () => {
    const played = applyPlay(basePawling);
    const check = canPlay(played);
    expect(check.ok).toBe(false);
  });

  it("maps growth stages from xp", () => {
    expect(getGrowthStage(0)).toBe(1);
    expect(getGrowthStage(300)).toBe(2);
    expect(getGrowthStage(700)).toBe(3);
  });
});
