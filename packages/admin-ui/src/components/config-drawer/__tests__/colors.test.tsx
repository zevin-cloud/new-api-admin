import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, it } from "vitest";
import { AdminProvider, createAdminI18n, adminLanguages } from "../../../admin-provider";
import { SidebarProvider } from "../../ui/sidebar";
import { ConfigDrawer } from "../../config-drawer";
import {
  normalizeThemeColor,
  getThemeColorForeground,
  THEME_PRESETS,
} from "../../../lib/theme-customization";
beforeEach(() => localStorage.clear());
it("provides translated preset names in all seven languages", () => {
  for (const language of adminLanguages) {
    const instance = createAdminI18n(language.value);
    for (const preset of THEME_PRESETS)
      expect(instance.exists(preset.name), `${language.value}: ${preset.name}`).toBe(true);
  }
});
it("renders the preset label instead of the untranslated lookup key", async () => {
  render(
    <AdminProvider language="zhCN">
      <SidebarProvider>
        <ConfigDrawer />
      </SidebarProvider>
    </AdminProvider>,
  );
  await userEvent.click(screen.getByRole("button", { name: "打开主题设置" }));
  expect(
    within(screen.getByRole("radiogroup", { name: "选择颜色预设" })).getByRole("radio", {
      name: "默认",
    }),
  ).toBeVisible();
  expect(screen.queryByText("preset.default")).not.toBeInTheDocument();
});

function ThemeFixture() {
  return (
    <AdminProvider language="en">
      <SidebarProvider>
        <ConfigDrawer />
      </SidebarProvider>
    </AdminProvider>
  );
}
it("previews and saves valid colors, keeps the last valid color on errors, and restores defaults", async () => {
  const user = userEvent.setup();
  const view = render(<ThemeFixture />);
  await user.click(screen.getByRole("button", { name: "Open theme settings" }));
  await user.click(screen.getByRole("radio", { name: "Custom color" }));
  const hex = screen.getByRole("textbox", { name: "HEX color" });
  fireEvent.change(hex, { target: { value: "#123456" } });
  expect(document.body.style.getPropertyValue("--custom-theme-color")).toBe("#123456");
  fireEvent.change(hex, { target: { value: "#xyz" } });
  expect(hex).toHaveAttribute("aria-invalid", "true");
  expect(screen.getByText("Enter a valid HEX color, such as #8B5CF6.")).toBeVisible();
  expect(document.body.style.getPropertyValue("--custom-theme-color")).toBe("#123456");
  fireEvent.change(hex, { target: { value: "#ABC" } });
  fireEvent.blur(hex);
  expect(hex).toHaveValue("#aabbcc");
  fireEvent.change(screen.getByLabelText("Pick a color"), { target: { value: "#ff8800" } });
  expect(hex).toHaveValue("#ff8800");
  await user.click(
    within(screen.getByRole("radiogroup", { name: "Select color preset" })).getByRole("radio", {
      name: "Default",
    }),
  );
  expect(document.body.style.getPropertyValue("--custom-theme-color")).toBe("");
  await user.click(screen.getByRole("radio", { name: "Custom color" }));
  expect(screen.getByRole("textbox", { name: "HEX color" })).toHaveValue("#ff8800");
  view.unmount();
  render(<ThemeFixture />);
  expect(document.body.style.getPropertyValue("--custom-theme-color")).toBe("#ff8800");
  await user.click(screen.getByRole("button", { name: "Open theme settings" }));
  expect(screen.getByRole("radio", { name: "Custom color" })).toHaveAttribute(
    "aria-checked",
    "true",
  );
  await user.click(screen.getByRole("button", { name: "Reset all settings to default values" }));
  expect(document.body.style.getPropertyValue("--custom-theme-color")).toBe("");
  await user.click(screen.getByRole("radio", { name: "Custom color" }));
  expect(screen.getByRole("textbox", { name: "HEX color" })).toHaveValue("#8b5cf6");
});
it("normalizes HEX input and chooses readable text for light and dark custom colors", () => {
  expect(normalizeThemeColor(" #AbC ")).toBe("#aabbcc");
  expect(normalizeThemeColor("#123456")).toBe("#123456");
  expect(normalizeThemeColor("red")).toBeNull();
  expect(normalizeThemeColor("#12345g")).toBeNull();
  expect(getThemeColorForeground("#ffffff")).toBe("#000000");
  expect(getThemeColorForeground("#000000")).toBe("#ffffff");
});
