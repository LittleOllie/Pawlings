import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatApplicationReferenceCode } from "@/lib/application-reference";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateAddress(address: string, chars = 6): string {
  if (address.length <= chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}…${address.slice(-chars)}`;
}

export function formatDate(
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options,
  });
}

export function formatDateTime(
  date: string | Date,
  timezone = "UTC"
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: timezone,
  });
}

/** @deprecated Use allocateApplicationReferenceCode() for live submissions */
export function generateReferenceCode(): string {
  return formatApplicationReferenceCode(1);
}

export function generateCollabReferenceCode(): string {
  const year = new Date().getFullYear();
  const num = Math.floor(1000 + Math.random() * 8999);
  return `COL-${year}-${String(num).padStart(4, "0")}`;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

/** Display Pawling signature from stored signature_data */
export function formatSignatureFromData(signatureData: string | null): string | null {
  if (!signatureData) return null;
  if (signatureData.startsWith("text:")) {
    return signatureData.slice(5).trim() || null;
  }
  if (signatureData.startsWith("data:image")) {
    return "Drawn signature";
  }
  return signatureData.trim() || null;
}
