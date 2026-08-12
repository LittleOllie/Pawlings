import type { Pawling } from "@/types/dashboard";
import type { PawlingsOwnershipProvider } from "./types";
import {
  createDefaultPawlingCare,
  demoPawlingCountForWallet,
  isKnownEmptyWallet,
  isPreviewDemoWallet,
  PACK_FEATURED_CATALOG,
  selectMockPawlingsForWallet,
} from "./mock-data";

export class MockPawlingsOwnershipProvider implements PawlingsOwnershipProvider {
  async getPawlingsForWallet(
    walletAddress: string,
    options?: { forceEmpty?: boolean; forceCount?: number }
  ): Promise<Pawling[]> {
    if (options?.forceEmpty || isKnownEmptyWallet(walletAddress)) {
      return [];
    }

    if (isPreviewDemoWallet(walletAddress) && options?.forceCount == null) {
      return PACK_FEATURED_CATALOG.map((item) =>
        createDefaultPawlingCare(item, walletAddress)
      );
    }

    const count = options?.forceCount ?? demoPawlingCountForWallet(walletAddress);
    const catalogItems = selectMockPawlingsForWallet(walletAddress, count);
    return catalogItems.map((item) => createDefaultPawlingCare(item, walletAddress));
  }
}

/** TODO(post-mint): OnChainPawlingsOwnershipProvider — ERC-721/1155 balanceOf + tokenURI */
export function createOwnershipProvider(): PawlingsOwnershipProvider {
  if (process.env.PAWLINGS_MOCK_OWNERSHIP === "false") {
    throw new Error("On-chain ownership provider is not configured yet.");
  }
  return new MockPawlingsOwnershipProvider();
}
