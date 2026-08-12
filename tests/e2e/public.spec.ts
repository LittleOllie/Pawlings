import { test, expect, type Page } from "@playwright/test";
import { INTRO_SESSION_KEY } from "../../src/config/intro-motion";

const HERO_HEADING = /begin your official adoption papers/i;
const BEGIN_ADOPTION = /begin adoption/i;

async function skipIntroIfVisible(page: Page) {
  const skip = page.getByRole("button", { name: /skip intro/i });
  try {
    await skip.waitFor({ state: "visible", timeout: 8000 });
    await skip.click();
  } catch {
    // Intro may auto-complete (reduced motion) or already be finished.
  }
}

/** Wait for landing hero — optionally skip intro overlay first. */
async function readyLanding(page: Page, { skipIntro = true } = {}) {
  if (skipIntro) {
    await skipIntroIfVisible(page);
  }
  await expect(page.getByRole("heading", { name: HERO_HEADING })).toBeVisible({
    timeout: 15000,
  });
}

test.describe("Public website", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((key) => {
      sessionStorage.setItem(key, "true");
    }, INTRO_SESSION_KEY);
  });

  test("landing page loads with hero and adoption papers", async ({ page }) => {
    await page.goto("/");
    await readyLanding(page);
    await page.getByRole("button", { name: BEGIN_ADOPTION }).first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("textbox", { name: /x handle/i })).toBeVisible();
  });

  test("first visit can reach landing", async ({ page }) => {
    await page.addInitScript((key) => {
      sessionStorage.removeItem(key);
    }, INTRO_SESSION_KEY);
    await page.goto("/");
    await readyLanding(page);
    await expect(page.getByRole("heading", { name: HERO_HEADING })).toBeVisible();
  });
});

test.describe("Intro session", () => {
  test("session storage prevents repeat intro", async ({ page }) => {
    await page.goto("/");
    await page.evaluate((key) => sessionStorage.removeItem(key), INTRO_SESSION_KEY);
    await page.reload();
    await readyLanding(page);
    await expect
      .poll(async () =>
        page.evaluate((key) => sessionStorage.getItem(key), INTRO_SESSION_KEY)
      )
      .toBe("true");
    await page.reload();
    await expect(page.getByRole("button", { name: /skip intro/i })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: HERO_HEADING })).toBeVisible({
      timeout: 15000,
    });
  });
});

test.describe("Public website (continued)", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((key) => {
      sessionStorage.setItem(key, "true");
    }, INTRO_SESSION_KEY);
  });

  test("navigation sections exist", async ({ page }) => {
    await page.goto("/");
    await readyLanding(page);
    await expect(page.locator("#home")).toBeAttached();
    await expect(page.locator("#how-it-works")).toBeAttached();
    await expect(page.locator("#roadmap")).toBeAttached();
    await expect(page.locator("#faq")).toBeAttached();
  });

  test("public copy does not say whitelist", async ({ page }) => {
    await page.goto("/");
    await readyLanding(page);
    const body = await page.locator("body").innerText();
    expect(body.toLowerCase()).not.toContain("whitelist");
  });

  test("privacy and terms pages load", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.locator("h1")).toContainText("Privacy");

    await page.goto("/terms");
    await expect(page.locator("h1")).toContainText("Terms");
  });

  test("checker shows coming soon when disabled", async ({ page }) => {
    await page.goto("/check");
    await expect(page.locator("h1")).toBeVisible();
  });
});

test.describe("Adoption application", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((key) => {
      sessionStorage.setItem(key, "true");
    }, INTRO_SESSION_KEY);
    await page.goto("/");
    await readyLanding(page);
  });

  test("apply route redirects to home adopt section", async ({ page }) => {
    await page.goto("/apply");
    await expect(page).toHaveURL(/\/(#adopt)?$/);
    await expect(page.locator("#adopt")).toBeAttached();
  });

  test("multi-step adoption flow opens from CTA", async ({ page }) => {
    await page.getByRole("button", { name: BEGIN_ADOPTION }).first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("textbox", { name: /x handle/i })).toBeVisible();
    await expect(page.getByLabel(/email address/i)).toHaveCount(0);
    await expect(page.getByLabel(/referral/i)).toHaveCount(0);
  });

  test("wallet step appears after guardian details", async ({ page }) => {
    await page.locator("#home").getByRole("button", { name: BEGIN_ADOPTION }).click();
    await page.getByRole("button", { name: /continue/i }).click();
    await expect(
      page.getByLabel(/future guardian wallet|wallet address/i)
    ).toBeVisible();
  });
});

test.describe("Admin", () => {
  test("admin login page loads", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
  });

  test("unauthenticated admin routes redirect to login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});
