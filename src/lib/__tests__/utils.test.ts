import { describe, it, expect } from "vitest";
import {
  normalizeWalletAddress,
  isValidWalletAddress,
  toChecksumAddress,
} from "@/lib/wallet";
import {
  normalizeXHandle,
  isValidXHandle,
  formatXDisplay,
} from "@/lib/x-handle";
import { getApplicationAvailability } from "@/lib/application-status";
import { parseWalletCsv, applicationsToCsv } from "@/lib/csv";
import { hasMinRole } from "@/lib/permissions";
import type { SiteSettings } from "@/types/database";

const TEST_WALLET = "0x742d35cc6634c0532925a3b844bc9e7595f0beb0";
const TEST_WALLET_LOWER = TEST_WALLET;

describe("wallet normalization", () => {
  it("normalizes to lowercase", () => {
    expect(normalizeWalletAddress(TEST_WALLET)).toBe(TEST_WALLET_LOWER);
  });

  it("trims whitespace", () => {
    expect(normalizeWalletAddress(`  ${TEST_WALLET}  `)).toBe(
      TEST_WALLET_LOWER
    );
  });

  it("validates correct addresses", () => {
    expect(isValidWalletAddress(TEST_WALLET)).toBe(true);
  });

  it("rejects invalid addresses", () => {
    expect(isValidWalletAddress("not-a-wallet")).toBe(false);
    expect(isValidWalletAddress("0x123")).toBe(false);
  });

  it("checksums addresses", () => {
    const checksummed = toChecksumAddress(TEST_WALLET_LOWER);
    expect(checksummed).toMatch(/^0x[a-fA-F0-9]{40}$/);
  });
});

describe("X handle normalization", () => {
  it("normalizes @username", () => {
    expect(normalizeXHandle("@TestUser")).toBe("testuser");
  });

  it("extracts from URL", () => {
    expect(normalizeXHandle("https://x.com/TestUser")).toBe("testuser");
    expect(normalizeXHandle("https://twitter.com/TestUser")).toBe("testuser");
  });

  it("validates handles", () => {
    expect(isValidXHandle("@valid_user")).toBe(true);
    expect(isValidXHandle("invalid user!")).toBe(false);
    expect(isValidXHandle("")).toBe(true);
  });

  it("formats display", () => {
    expect(formatXDisplay("testuser")).toBe("@testuser");
  });
});

describe("application availability", () => {
  const baseSettings: SiteSettings = {
    id: "1",
    applications_open: true,
    applications_paused: false,
    opening_date: null,
    closing_date: null,
    max_submissions: null,
    allow_duplicate_wallets: false,
    signature_required: true,
    signature_fallback_enabled: false,
    x_field_enabled: true,
    x_field_required: false,
    discord_field_enabled: true,
    discord_field_required: false,
    email_field_enabled: false,
    email_field_required: false,
    referral_field_enabled: true,
    checker_enabled: false,
    checker_heading: "",
    checker_approved_message: "",
    checker_not_approved_message: "",
    checker_closed_message: "",
    project_name: "Test",
    project_short_name: "T",
    project_tagline: "",
    project_description: "",
    support_email: "test@test.com",
    x_url: "",
    discord_url: "",
    website_url: "",
    announcement_message: null,
    public_status_wording: "Open",
    display_timezone: "UTC",
    updated_at: new Date().toISOString(),
  };

  it("returns open when settings allow", () => {
    const result = getApplicationAvailability(baseSettings, 0);
    expect(result.canSubmit).toBe(true);
    expect(result.status).toBe("open");
  });

  it("returns closed when applications_open is false", () => {
    const result = getApplicationAvailability(
      { ...baseSettings, applications_open: false },
      0
    );
    expect(result.canSubmit).toBe(false);
    expect(result.status).toBe("closed");
  });

  it("returns max_reached when limit hit", () => {
    const result = getApplicationAvailability(
      { ...baseSettings, max_submissions: 100 },
      100
    );
    expect(result.canSubmit).toBe(false);
    expect(result.status).toBe("max_reached");
  });
});

describe("CSV parsing", () => {
  it("parses valid wallet CSV", () => {
    const csv = `wallet_address,allocation_type,notes
${TEST_WALLET},OG,Test note`;
    const result = parseWalletCsv(csv);
    expect(result.valid).toHaveLength(1);
    expect(result.invalid).toHaveLength(0);
  });

  it("reports invalid rows", () => {
    const csv = `wallet_address
not-valid
${TEST_WALLET}`;
    const result = parseWalletCsv(csv);
    expect(result.valid).toHaveLength(1);
    expect(result.invalid).toHaveLength(1);
  });

  it("exports CSV correctly", () => {
    const csv = applicationsToCsv(
      [{ name: "test", value: "hello, world" }],
      ["name", "value"]
    );
    expect(csv).toContain('"hello, world"');
  });
});

describe("permissions", () => {
  it("checks role hierarchy", () => {
    expect(hasMinRole("admin", "reviewer")).toBe(true);
    expect(hasMinRole("reviewer", "admin")).toBe(false);
    expect(hasMinRole("owner", "admin")).toBe(true);
    expect(hasMinRole(null, "reviewer")).toBe(false);
  });
});
