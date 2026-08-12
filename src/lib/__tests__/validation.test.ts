import { describe, it, expect } from "vitest";
import { simpleApplicationSchema } from "@/lib/validation";
import { APPLICATION_EXPORT_FIELDS } from "@/lib/csv";

const validWallet = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";

const validSignature = "data:image/png;base64,iVBORw0KGgo=";

describe("simpleApplicationSchema", () => {
  const validPayload = {
    walletAddress: validWallet,
    xHandle: "@pawlings",
    signatureDataUrl: validSignature,
    honeypot: "",
  };

  it("accepts complete adoption submission", () => {
    const result = simpleApplicationSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("accepts wallet, X, signature and Discord", () => {
    const result = simpleApplicationSchema.safeParse({
      ...validPayload,
      discordUsername: "packmember",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing wallet", () => {
    const result = simpleApplicationSchema.safeParse({
      ...validPayload,
      walletAddress: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid wallet", () => {
    const result = simpleApplicationSchema.safeParse({
      ...validPayload,
      walletAddress: "not-a-wallet",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing X handle", () => {
    const result = simpleApplicationSchema.safeParse({
      walletAddress: validWallet,
      signatureDataUrl: validSignature,
      xHandle: "",
      honeypot: "",
    });
    expect(result.success).toBe(false);
  });

  it("allows empty optional Discord handle", () => {
    const result = simpleApplicationSchema.safeParse({
      ...validPayload,
      discordUsername: "",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid X handle when provided", () => {
    const result = simpleApplicationSchema.safeParse({
      ...validPayload,
      xHandle: "not a valid handle!!!",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid Discord handle when provided", () => {
    const result = simpleApplicationSchema.safeParse({
      ...validPayload,
      discordUsername: "x",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing signature", () => {
    const result = simpleApplicationSchema.safeParse({
      walletAddress: validWallet,
      xHandle: "@pawlings",
      honeypot: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects honeypot", () => {
    const result = simpleApplicationSchema.safeParse({
      ...validPayload,
      honeypot: "bot",
    });
    expect(result.success).toBe(false);
  });
});

describe("APPLICATION_EXPORT_FIELDS", () => {
  it("includes only simplified whitelist fields and metadata", () => {
    expect(APPLICATION_EXPORT_FIELDS).toEqual([
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
    ]);
    expect(APPLICATION_EXPORT_FIELDS).not.toContain("email");
    expect(APPLICATION_EXPORT_FIELDS).not.toContain("referral_source");
    expect(APPLICATION_EXPORT_FIELDS).not.toContain("application_answer");
  });
});
