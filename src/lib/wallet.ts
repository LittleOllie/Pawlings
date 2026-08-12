import { getAddress, isAddress } from "viem";

export function normalizeWalletAddress(address: string): string {
  return address.trim().toLowerCase();
}

export function isValidWalletAddress(address: string): boolean {
  const trimmed = address.trim();
  if (!trimmed.startsWith("0x")) return false;
  return isAddress(trimmed);
}

export function toChecksumAddress(address: string): string {
  const trimmed = address.trim();
  if (!isAddress(trimmed)) {
    throw new Error("Invalid Ethereum address");
  }
  return getAddress(trimmed);
}

export function formatWalletForDisplay(address: string): string {
  try {
    return getAddress(address.trim());
  } catch {
    return address.trim();
  }
}
