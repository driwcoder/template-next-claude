import { expect, test } from "@playwright/test";

test("home renders and links to the demo", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /fluid, optimistic ui/i })).toBeVisible();
  await page.getByRole("link", { name: /see the optimistic demo/i }).click();
  await expect(page).toHaveURL(/\/demo$/);
});

test("adding a todo updates the list optimistically", async ({ page }) => {
  await page.goto("/demo");
  const input = page.getByLabel("Task title");
  await input.fill("walk the dog");
  await page.getByRole("button", { name: "Add" }).click();
  await expect(page.getByText("walk the dog")).toBeVisible();
});
