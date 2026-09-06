import { expect, test } from "@playwright/test";

test("signup lands on the dashboard, sign out clears it", async ({ page }) => {
  // Unique email so re-runs against a warm in-memory store don't collide.
  const email = `user-${Date.now()}@template.dev`;

  await page.goto("/signup");
  await page.getByLabel("Name").fill("Test User");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("supersecret123");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByText(`Signed in as ${email}`)).toBeVisible();

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/$/);

  // Protected route now bounces back to login.
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login$/);
});
