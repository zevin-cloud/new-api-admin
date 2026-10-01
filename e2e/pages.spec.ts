import { test, expect } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("new-api-admin:language", "en"));
});
test("all page types render without runtime errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const [path, title] of [
    ["/", "Overview"],
    ["/projects", "Projects"],
    ["/forms", "Complete form"],
    ["/forms/dialog", "Dialog form"],
    ["/forms/drawer", "Drawer form"],
    ["/projects/PRJ-001", "Project details"],
    ["/settings", "Settings"],
    ["/components", "Components"],
  ]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
  }
  for (const label of [
    "Feedback and overlays",
    "Navigation",
    "Content and layout",
    "Basic components",
  ]) {
    await page.getByRole("tab", { name: label, exact: true }).click();
    await expect(page.getByRole("tabpanel")).toBeVisible();
  }
  expect(errors).toEqual([]);
  await page.screenshot({ path: "artifacts/components-desktop.png", fullPage: true });
  await page.goto("/projects");
  await expect(page.getByText("Atlas website", { exact: true })).toBeVisible();
  await page.screenshot({ path: "artifacts/projects-desktop.png", fullPage: true });
  await page.getByRole("button", { name: "Toggle theme", exact: true }).click();
  await page.getByRole("menuitem", { name: "Dark", exact: true }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.screenshot({ path: "artifacts/projects-desktop-dark.png", fullPage: true });
  await page.goto("/forms");
  await expect(page.getByLabel("Name", { exact: false }).first()).toBeVisible();
  await page.screenshot({ path: "artifacts/form-desktop.png", fullPage: true });
});
test("create, view and edit share the same data; failures preserve input", async ({ page }) => {
  await page.goto("/forms");
  await page.getByRole("textbox", { name: "Name", exact: false }).fill("Reusable workspace");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(page.getByText("Saved successfully", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Projects", exact: true }).click();
  await page.getByRole("button", { name: "Reusable workspace", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Reusable workspace" })).toBeVisible();
  await page.getByRole("button", { name: "Edit", exact: true }).click();
  await page.getByRole("textbox", { name: "Name", exact: false }).fill("Updated workspace");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Updated workspace" })).toBeVisible();
  await page.getByLabel("Preview state").selectOption("submit-error");
  await page.getByRole("button", { name: "Edit", exact: true }).click();
  await page.getByRole("textbox", { name: "Name", exact: false }).fill("Retained input");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(
    page.getByText("Save failed. Your changes are preserved.", { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Name", exact: false })).toHaveValue(
    "Retained input",
  );
  await page.keyboard.press("Tab");
  expect(
    await page.getByRole("dialog").evaluate((dialog) => dialog.contains(document.activeElement)),
  ).toBe(true);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("alertdialog")).toBeVisible();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
test("mobile list and form fit viewport; language and theme update", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/projects");
  await expect(page.getByText("Atlas website", { exact: true }).first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(391);
  await page.screenshot({ path: "artifacts/projects-mobile.png", fullPage: true });
  await page.getByRole("button", { name: "Toggle theme", exact: true }).click();
  await page.getByRole("menuitem", { name: "Dark", exact: true }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.screenshot({ path: "artifacts/projects-mobile-dark.png", fullPage: true });
  await page.goto("/forms");
  await page.getByLabel("Language", { exact: true }).selectOption("zhCN");
  await expect(page.getByRole("heading", { name: "完整表单", exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(391);
  await page.screenshot({ path: "artifacts/form-mobile.png", fullPage: true });
});
test("table search, expansion, pagination and bulk archive remain interactive", async ({
  page,
}) => {
  await page.goto("/projects");
  await page.getByPlaceholder("Search projects...").fill("Atlas");
  await expect(page.getByText("Atlas website", { exact: true })).toBeVisible();
  await expect(page.getByText("Customer portal", { exact: true })).toHaveCount(0);
  await page.getByPlaceholder("Search projects...").fill("");
  await page.getByRole("button", { name: "Expand Atlas website", exact: true }).click();
  await expect(page.getByRole("button", { name: "Quick view", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Go to next page", exact: true }).click();
  await expect(page.getByText("Service desk", { exact: true })).toBeVisible();
  await page.getByRole("switch", { name: "Batch Operations", exact: true }).check();
  await page.getByRole("checkbox", { name: "Select all", exact: true }).check();
  await page.getByRole("button", { name: "Archive", exact: true }).click();
  await expect(page.getByText("Saved successfully", { exact: true })).toBeVisible();
  await expect(page.getByText("Atlas website", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Go to next page", exact: true }).click();
  await expect(page.getByText("Archived", { exact: true })).toHaveCount(2);
});
test("advanced form errors select the right tab and dirty navigation is guarded", async ({
  page,
}) => {
  await page.goto("/forms");
  await page.getByRole("textbox", { name: "Name", exact: false }).fill("Pending draft");
  await page.getByRole("tab", { name: "Advanced options", exact: true }).click();
  await page.getByRole("switch", { name: "Notifications", exact: true }).check();
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(
    page.getByRole("textbox", { name: "Notification email", exact: false }),
  ).toHaveAttribute("aria-invalid", "true");
  await page.getByRole("button", { name: "Projects", exact: true }).click();
  await expect(page.getByRole("alertdialog")).toBeVisible();
  await page.getByRole("alertdialog").getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page).toHaveURL(/\/forms$/);
  await page.getByLabel("Preview state").selectOption("readonly");
  await page.getByRole("tab", { name: "Basic information", exact: true }).click();
  await expect(page.getByRole("textbox", { name: "Name", exact: false })).toBeDisabled();
  await page.getByRole("tab", { name: "Advanced options", exact: true }).click();
  await expect(page.getByRole("button", { name: "Start date", exact: true })).toBeDisabled();
});

test("drawer navigation scrolls and focuses each section while preserving values", async ({
  page,
}) => {
  await page.goto("/forms/drawer");
  await page.getByRole("button", { name: "Open form", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("navigation", { name: "Form sections" })).toBeVisible();
  await dialog.getByRole("textbox", { name: /^Name/ }).fill("Section draft");
  await expect(dialog.getByRole("button", { name: "Basic information: Completed" })).toBeVisible();
  await dialog.getByRole("button", { name: "Milestones: Completed" }).click();
  await expect(dialog.getByRole("region", { name: "Milestones", exact: true })).toBeFocused();
  await expect(dialog.getByRole("button", { name: "Add milestone" })).toBeInViewport();
  await expect(dialog.getByRole("button", { name: "Save changes" })).toBeInViewport();
  await dialog.getByRole("button", { name: "Basic information: Completed" }).focus();
  await page.keyboard.press("Enter");
  await expect(
    dialog.getByRole("region", { name: "Basic information", exact: true }),
  ).toBeFocused();
  await expect(dialog.getByRole("textbox", { name: /^Name/ })).toHaveValue("Section draft");
  await page.screenshot({ path: "artifacts/form-sections-desktop.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(dialog.getByRole("button", { name: "Save changes" })).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(391);
  expect(
    await dialog
      .getByRole("region", { name: "Basic information", exact: true })
      .evaluate((el) => el.getBoundingClientRect().right),
  ).toBeLessThanOrEqual(390);
  await page.screenshot({ path: "artifacts/form-sections-mobile.png", fullPage: true });
});
test("primary table switches control selection, ID ordering and collapsible tag groups", async ({
  page,
}) => {
  await page.goto("/projects");
  await expect(page.getByText("Atlas website", { exact: true })).toBeVisible();
  await expect(page.getByRole("checkbox", { name: "Select all", exact: true })).toHaveCount(0);
  await page.getByRole("switch", { name: "Batch Operations", exact: true }).check();
  await page.getByRole("checkbox", { name: "Select all", exact: true }).check();
  await expect(page.getByRole("button", { name: "Archive", exact: true })).toBeVisible();
  await page.getByRole("switch", { name: "Batch Operations", exact: true }).uncheck();
  await expect(page.getByRole("button", { name: "Archive", exact: true })).toHaveCount(0);
  await page.getByRole("switch", { name: "Sort by ID", exact: true }).check();
  await expect(page.getByRole("table").getByRole("row").nth(1)).toContainText("PRJ-012");
  await page.getByRole("switch", { name: "Tag Mode", exact: true }).check();
  const group = page.getByRole("button", { name: /^Engineering/ });
  await expect(group).toHaveAttribute("aria-expanded", "true");
  await group.click();
  await expect(group).toHaveAttribute("aria-expanded", "false");
  await group.click();
  await page.screenshot({ path: "artifacts/table-primary-actions.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "More actions", exact: true }).click();
  await expect(
    page.getByRole("menuitemcheckbox", { name: "Tag Mode", exact: true }),
  ).toHaveAttribute("aria-checked", "true");
  await page.getByRole("menuitemcheckbox", { name: "Tag Mode", exact: true }).click();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "More actions", exact: true }).click();
  await expect(
    page.getByRole("menuitemcheckbox", { name: "Tag Mode", exact: true }),
  ).toHaveAttribute("aria-checked", "false");
});

test("selected records expose a floating toolbar with real bulk actions", async ({ page }) => {
  await page.goto("/projects");
  await page.getByRole("switch", { name: "Batch Operations", exact: true }).check();
  const selectTwo = async () => {
    await page.getByRole("checkbox", { name: "Select Atlas website", exact: true }).check();
    await page.getByRole("checkbox", { name: "Select Customer portal", exact: true }).check();
  };
  await selectTwo();
  const toolbar = page.getByRole("toolbar", { name: "Bulk actions for 2 selected records" });
  await expect(toolbar).toBeInViewport();
  expect(await toolbar.evaluate((el) => getComputedStyle(el).position)).toBe("fixed");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(toolbar).toBeInViewport();
  await toolbar.getByRole("button", { name: "Disable selected records", exact: true }).click();
  await expect(toolbar).toHaveCount(0);
  await expect(
    page
      .getByRole("row")
      .filter({ has: page.getByRole("button", { name: "Atlas website", exact: true }) }),
  ).toContainText("Disabled");
  await selectTwo();
  await toolbar.getByRole("button", { name: "Enable selected records", exact: true }).click();
  await expect(toolbar).toHaveCount(0);
  await expect(
    page
      .getByRole("row")
      .filter({ has: page.getByRole("button", { name: "Atlas website", exact: true }) }),
  ).not.toContainText("Disabled");
  await selectTwo();
  await toolbar.getByRole("button", { name: "Set tags", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByRole("textbox", { name: "Tags", exact: true })
    .fill("Release");
  await page.keyboard.press("Enter");
  await page.getByRole("dialog").getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByText("Release", { exact: true })).toHaveCount(2);
  await selectTwo();
  await page.getByLabel("Preview state").selectOption("submit-error");
  await toolbar.getByRole("button", { name: "Set tags", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByRole("textbox", { name: "Tags", exact: true })
    .fill("Retained tag");
  await page.keyboard.press("Enter");
  await page.getByRole("dialog").getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(page.getByRole("dialog").getByText("Request failed", { exact: true })).toBeVisible();
  await expect(page.getByRole("dialog").getByText("Retained tag", { exact: true })).toBeVisible();
  await page.getByRole("dialog").getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(toolbar).toBeVisible();
  await page.getByLabel("Preview state").selectOption("ready");
  await toolbar.getByRole("button", { name: "Delete", exact: true }).click();
  await page.getByRole("alertdialog").getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(toolbar).toBeVisible();
  await page.getByRole("button", { name: "Toggle theme", exact: true }).click();
  await page.getByRole("menuitem", { name: "Dark", exact: true }).click();
  await page.keyboard.press("Escape");
  await page.screenshot({
    path: "artifacts/bulk-actions-desktop.png",
    animations: "disabled",
    fullPage: false,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(toolbar).toBeInViewport();
  await expect(toolbar.getByRole("button", { name: "Clear selection", exact: true })).toBeVisible();
  expect(await toolbar.evaluate((el) => el.getBoundingClientRect().right)).toBeLessThanOrEqual(390);
  await page.screenshot({
    path: "artifacts/bulk-actions-mobile.png",
    animations: "disabled",
    fullPage: false,
  });
  await toolbar.getByRole("button", { name: "Clear selection", exact: true }).click();
  await expect(toolbar).toHaveCount(0);
});

test("custom colors preview, persist and reset across desktop, dark mode and mobile", async ({
  page,
}) => {
  await page.goto("/projects");
  await page.getByRole("button", { name: "Open theme settings" }).click();
  const presets = page.getByRole("radiogroup", { name: "Select color preset" });
  await expect(presets.getByRole("radio", { name: "Default", exact: true })).toBeVisible();
  await expect(page.getByText("preset.default", { exact: true })).toHaveCount(0);
  await presets.getByRole("radio", { name: "Custom color", exact: true }).click();
  const hex = page.getByRole("textbox", { name: "HEX color" });
  await hex.fill("#167a65");
  await expect(page.locator("body")).toHaveCSS("--primary", "#167a65");
  await hex.fill("#oops");
  await expect(hex).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator("body")).toHaveCSS("--primary", "#167a65");
  await hex.fill("#167a65");
  await page.getByRole("radio", { name: "Select light", exact: true }).click();
  await hex.scrollIntoViewIfNeeded();
  await page.screenshot({ path: "artifacts/custom-color-desktop.png", animations: "disabled" });
  await page.reload();
  await expect(page.locator("body")).toHaveCSS("--primary", "#167a65");
  await page.getByRole("button", { name: "Open theme settings" }).click();
  await expect(hex).toHaveValue("#167a65");
  await page.getByRole("radio", { name: "Select dark", exact: true }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(page.locator("body")).toHaveCSS("--primary", "#167a65");
  await hex.scrollIntoViewIfNeeded();
  await page.screenshot({ path: "artifacts/custom-color-dark.png", animations: "disabled" });
  await page.keyboard.press("Escape");
  await page.getByLabel("Language", { exact: true }).selectOption("zhCN");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "打开主题设置" }).click();
  await expect(page.getByRole("radio", { name: "自定义颜色", exact: true })).toBeVisible();
  await expect(page.getByRole("radio", { name: "玫瑰花园", exact: true })).toBeVisible();
  await page.getByRole("textbox", { name: "HEX 色值" }).scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(391);
  await page.screenshot({ path: "artifacts/custom-color-mobile.png", animations: "disabled" });
  await page.getByRole("button", { name: "将所有设置重置为默认值" }).click();
  await expect(page.locator("body")).not.toHaveAttribute("data-theme-preset", "custom");
});
