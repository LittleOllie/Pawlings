import { isValidWalletAddress, normalizeWalletAddress } from "./wallet";

export interface CsvWalletRow {
  wallet_address: string;
  allocation_type?: string;
  allocation_amount?: number;
  notes?: string;
}

export interface CsvParseResult {
  valid: CsvWalletRow[];
  duplicates: string[];
  invalid: { row: number; value: string; reason: string }[];
}

export function parseWalletCsv(
  content: string,
  existingWallets: Set<string> = new Set()
): CsvParseResult {
  const lines = content.trim().split(/\r?\n/);
  if (lines.length === 0) {
    return { valid: [], duplicates: [], invalid: [] };
  }

  const header = lines[0].toLowerCase().split(",").map((h) => h.trim());
  const walletIdx = header.indexOf("wallet_address");
  if (walletIdx === -1) {
    throw new Error("CSV must include a wallet_address column");
  }

  const allocTypeIdx = header.indexOf("allocation_type");
  const allocAmountIdx = header.indexOf("allocation_amount");
  const notesIdx = header.indexOf("notes");

  const valid: CsvWalletRow[] = [];
  const duplicates: string[] = [];
  const invalid: { row: number; value: string; reason: string }[] = [];
  const seen = new Set<string>();

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cols = line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
    const rawAddress = cols[walletIdx] ?? "";

    if (!rawAddress) {
      invalid.push({ row: i + 1, value: "", reason: "Empty wallet address" });
      continue;
    }

    if (!isValidWalletAddress(rawAddress)) {
      invalid.push({
        row: i + 1,
        value: rawAddress,
        reason: "Invalid Ethereum address",
      });
      continue;
    }

    const normalized = normalizeWalletAddress(rawAddress);

    if (seen.has(normalized) || existingWallets.has(normalized)) {
      duplicates.push(normalized);
      continue;
    }

    seen.add(normalized);

    const row: CsvWalletRow = { wallet_address: rawAddress };

    if (allocTypeIdx >= 0 && cols[allocTypeIdx]) {
      row.allocation_type = cols[allocTypeIdx];
    }
    if (allocAmountIdx >= 0 && cols[allocAmountIdx]) {
      const amount = parseInt(cols[allocAmountIdx], 10);
      if (!isNaN(amount)) row.allocation_amount = amount;
    }
    if (notesIdx >= 0 && cols[notesIdx]) {
      row.notes = cols[notesIdx];
    }

    valid.push(row);
  }

  return { valid, duplicates, invalid };
}

export function applicationsToCsv(
  rows: Record<string, unknown>[],
  fields: string[]
): string {
  const escape = (val: unknown): string => {
    if (val === null || val === undefined) return "";
    const str = String(val);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const header = fields.join(",");
  const body = rows
    .map((row) => fields.map((f) => escape(row[f])).join(","))
    .join("\n");

  return `${header}\n${body}`;
}

export const APPLICATION_EXPORT_FIELDS = [
  "reference_code",
  "wallet_address",
  "x_handle",
  "discord_username",
  "status",
  "tags",
  "review_notes",
  "reviewer",
  "submitted_at",
  "reviewed_at",
] as const;

export const APPROVED_WALLET_EXPORT_FIELDS = [
  "wallet_address",
  "allocation_type",
  "allocation_amount",
  "source",
  "notes",
  "created_at",
] as const;
