import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { AdminProvider, createAdminI18n } from "../admin-provider";
import { DataTablePage, useDataTable } from "../components/data-table";
import { useTheme } from "../context/theme-provider";
import { useThemeCustomization } from "../context/theme-customization-provider";
import { toIntlLocale, formatNumber } from "../utils";
const records = [{ name: "Atlas" }, { name: "Orion" }];
const columns = [{ accessorKey: "name", header: "Name" }];
function StandaloneTable() {
  const { table } = useDataTable({
    data: records,
    columns,
    withPaginationRowModel: true,
    initialPagination: { pageIndex: 0, pageSize: 1 },
  });
  return (
    <DataTablePage
      table={table}
      columns={table.options.columns}
      toolbarProps={{ searchKey: "name", searchPlaceholder: "Search names" }}
    />
  );
}
function Preferences() {
  const theme = useTheme();
  const custom = useThemeCustomization();
  const [language, setLanguage] = useState("en");
  return (
    <>
      <button onClick={() => theme.setTheme("dark")}>Dark mode</button>
      <button onClick={() => custom.setRadius("lg")}>Large radius</button>
      <button onClick={() => setLanguage("zhTW")}>Change language</button>
      <span>{formatNumber(1234.56, toIntlLocale(language))}</span>
    </>
  );
}
describe("standalone library", () => {
  it("shows working pagination without any layout footer provider", async () => {
    render(
      <AdminProvider language="en">
        <StandaloneTable />
      </AdminProvider>,
    );
    expect(screen.getByText("Atlas")).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "Go to next page" }));
    expect(await screen.findByText("Orion")).toBeVisible();
    expect(screen.queryByText("Atlas")).not.toBeInTheDocument();
  });
  it("filters without a caller-managed filter state", async () => {
    render(
      <AdminProvider language="en">
        <StandaloneTable />
      </AdminProvider>,
    );
    await userEvent.type(screen.getByPlaceholderText("Search names"), "Orion");
    expect(await screen.findByText("Orion")).toBeVisible();
    expect(screen.queryByText("Atlas")).not.toBeInTheDocument();
  });
  it("applies theme preferences and formats interface language codes", async () => {
    render(
      <AdminProvider language="en">
        <Preferences />
      </AdminProvider>,
    );
    await userEvent.click(screen.getByText("Dark mode"));
    expect(document.documentElement).toHaveClass("dark");
    await userEvent.click(screen.getByText("Large radius"));
    expect(document.body).toHaveAttribute("data-theme-radius", "lg");
    await userEvent.click(screen.getByText("Change language"));
    expect(screen.getByText("1,234.56")).toBeVisible();
  });
  it.each(["en", "zhCN", "zhTW", "fr", "ja", "ru", "vi"])(
    "has translated public copy and a valid number locale for %s",
    (language) => {
      const i18n = createAdminI18n(language);
      expect(i18n.exists("Complete form")).toBe(true);
      expect(i18n.t("Complete form")).not.toBe("");
      expect(() => formatNumber(1234, toIntlLocale(language))).not.toThrow();
    },
  );
  it("falls back safely for an invalid Intl language", () => {
    expect(toIntlLocale("not_a_locale")).toBeUndefined();
  });
});
