import { describe, it, expect } from "vitest";
import { shouldShowIntro } from "@/lib/intro-session";
import { INTRO_SESSION_KEY } from "@/config/intro-motion";

describe("shouldShowIntro", () => {
  it("shows intro when not seen and motion allowed", () => {
    expect(shouldShowIntro(false, false)).toBe(true);
  });

  it("skips intro when already seen", () => {
    expect(shouldShowIntro(true, false)).toBe(false);
  });

  it("skips intro when reduced motion preferred", () => {
    expect(shouldShowIntro(false, true)).toBe(false);
  });
});

describe("INTRO_SESSION_KEY", () => {
  it("uses expected session storage key", () => {
    expect(INTRO_SESSION_KEY).toBe("pawlings-intro-seen");
  });
});
