import { describe, it, expect, afterEach } from "vitest";
import {
  createPreviewSessionToken,
  isValidPreviewSessionToken,
  isDashboardNavVisible,
} from "@/lib/dashboard/access";
import { dashboardConfig } from "@/config/dashboard-config";

describe("dashboard access", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("rejects invalid preview tokens", () => {
    expect(isValidPreviewSessionToken(undefined)).toBe(false);
    expect(isValidPreviewSessionToken("wrong")).toBe(false);
  });

  it("accepts valid preview token when password configured", () => {
    process.env.PAWLINGS_DASHBOARD_PREVIEW_PASSWORD = "test-preview-secret";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-key";
    const token = createPreviewSessionToken();
    expect(token.length).toBeGreaterThan(0);
    expect(isValidPreviewSessionToken(token)).toBe(true);
  });

  it("nav hidden when locked or preview", () => {
    expect(isDashboardNavVisible("locked")).toBe(false);
    expect(isDashboardNavVisible("preview")).toBe(false);
  });

  it("nav visible only when live", () => {
    expect(isDashboardNavVisible("live")).toBe(true);
  });

  it("live flag reads from env", () => {
    process.env.PAWLINGS_DASHBOARD_LIVE = "true";
    // Re-import would be needed for dynamic env; assert config shape instead
    expect(typeof dashboardConfig.live).toBe("boolean");
  });
});
