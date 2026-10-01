import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { it, expect } from "vitest";
import { AdminProvider } from "../../../../admin-provider";
import { DataTableBulkActions, useDataTable } from "../../index";
const records = [{ name: "One" }, { name: "Two" }];
const columns = [{ accessorKey: "name" }];
function Fixture() {
  const { table } = useDataTable({
    data: records,
    columns,
    initialRowSelection: { 0: true, 1: true },
  });
  return (
    <AdminProvider language="en">
      <DataTableBulkActions table={table} entityName="Projects">
        <button disabled>Unavailable</button>
        <button>Available</button>
      </DataTableBulkActions>
    </AdminProvider>
  );
}
it("uses the supplied translated entity label without adding another plural suffix", () => {
  render(<Fixture />);
  expect(screen.getByRole("toolbar")).toHaveTextContent("Projects selected");
  expect(screen.getByRole("toolbar")).not.toHaveTextContent("Projectss");
});
it("arrow navigation skips disabled actions and Escape clears selection", async () => {
  render(<Fixture />);
  screen.getByRole("button", { name: "Clear selection" }).focus();
  await userEvent.keyboard("{ArrowRight}");
  expect(screen.getByRole("button", { name: "Available" })).toHaveFocus();
  await userEvent.keyboard("{Escape}");
  expect(screen.queryByRole("toolbar")).not.toBeInTheDocument();
});
