import { describe, it, expect } from "vitest";
import { dashboardConfig } from "@/config/dashboard-config";
import { MockPawlingsOwnershipProvider } from "@/lib/dashboard/ownership";
import {
  demoPawlingCountForWallet,
  isKnownEmptyWallet,
  isPreviewDemoWallet,
  PACK_FEATURED_CATALOG,
  selectMockPawlingsForWallet,
} from "@/lib/dashboard/ownership/mock-data";

describe("mock ownership", () => {
  const provider = new MockPawlingsOwnershipProvider();
  const wallet = dashboardConfig.previewDemoWallet;
  const otherWallet = "0x1111111111111111111111111111111111111111";

  it("returns all four pack Pawlings for preview demo wallet", async () => {
    expect(isPreviewDemoWallet(wallet)).toBe(true);
    const pawlings = await provider.getPawlingsForWallet(wallet);
    expect(pawlings).toHaveLength(4);
    expect(pawlings.map((p) => p.name)).toEqual(
      PACK_FEATURED_CATALOG.map((p) => p.name)
    );
  });

  it("returns deterministic pawling count for other wallets", () => {
    const a = demoPawlingCountForWallet(otherWallet);
    const b = demoPawlingCountForWallet(otherWallet);
    expect(a).toBe(b);
    expect(a).toBeGreaterThanOrEqual(1);
    expect(a).toBeLessThanOrEqual(3);
  });

  it("returns stable pawling selection", async () => {
    const first = await provider.getPawlingsForWallet(wallet);
    const second = await provider.getPawlingsForWallet(wallet);
    expect(first.map((p) => p.tokenId)).toEqual(second.map((p) => p.tokenId));
  });

  it("returns empty for known empty wallet", async () => {
    const empty = await provider.getPawlingsForWallet(
      "0x0000000000000000000000000000000000000001"
    );
    expect(empty).toHaveLength(0);
    expect(isKnownEmptyWallet("0x0000000000000000000000000000000000000001")).toBe(true);
  });

  it("respects force empty option", async () => {
    const pawlings = await provider.getPawlingsForWallet(wallet, { forceEmpty: true });
    expect(pawlings).toHaveLength(0);
  });

  it("respects force count option", async () => {
    const pawlings = await provider.getPawlingsForWallet(otherWallet, { forceCount: 2 });
    expect(pawlings).toHaveLength(2);
  });

  it("selects unique token ids", () => {
    const selected = selectMockPawlingsForWallet(otherWallet, 3);
    const ids = selected.map((p) => p.tokenId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
