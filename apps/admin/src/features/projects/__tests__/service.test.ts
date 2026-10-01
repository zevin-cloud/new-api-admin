import { beforeEach, describe, expect, it } from "vitest";
import { projectDefaults } from "../schema";
import { DemoError, projectService } from "../service";
beforeEach(() => projectService.reset());
describe("project data service", () => {
  it("creates and updates a record visible in both list and detail", async () => {
    const saved = await projectService.save({
      ...projectDefaults,
      name: "New workspace",
      samplePassword: "not-persisted",
    });
    expect(saved.samplePassword).toBe("");
    expect((await projectService.list({ search: "New workspace" })).items).toHaveLength(1);
    const edited = await projectService.save({ ...saved, name: "Renamed" }, saved.id);
    expect(await projectService.get(saved.id)).toEqual(edited);
    expect(edited.history.map((event) => event.action)).toEqual(["Created", "Updated"]);
  });
  it("combines search, filters, sort and pagination without changing total", async () => {
    const result = await projectService.list({
      status: ["Active"],
      sort: { id: "progress", desc: true },
      page: 1,
      pageSize: 2,
    });
    expect(result.total).toBe(8);
    expect(result.items.map((p) => p.id)).toEqual(["PRJ-009", "PRJ-008"]);
    expect((await projectService.list({ search: "atlas", status: ["Active"] })).total).toBe(0);
  });
  it("keeps stored data unchanged after simulated save or field errors", async () => {
    const before = await projectService.get("PRJ-001");
    await expect(
      projectService.save({ ...before, name: "Changed" }, before.id, "submit-error"),
    ).rejects.toThrow("Save failed");
    await expect(
      projectService.save({ ...before, name: "Changed" }, before.id, "field-error"),
    ).rejects.toMatchObject({ field: "name" });
    expect(await projectService.get(before.id)).toEqual(before);
  });
  it("validates conditional fields and rejects invalid JSON before mutation", async () => {
    const before = (await projectService.list()).total;
    await expect(
      projectService.save({
        ...projectDefaults,
        name: "Invalid",
        notifications: true,
        notificationEmail: "",
      }),
    ).rejects.toThrow();
    await expect(
      projectService.save({ ...projectDefaults, name: "Invalid", metadata: "[]" }),
    ).rejects.toThrow();
    expect((await projectService.list()).total).toBe(before);
  });
  it("archives selected records, deletes selected records, and restores fixtures", async () => {
    await projectService.archive(["PRJ-001", "PRJ-002"]);
    expect((await projectService.list({ status: ["Archived"] })).total).toBe(2);
    await projectService.remove(["PRJ-001", "PRJ-002"]);
    await expect(projectService.get("PRJ-001")).rejects.toBeInstanceOf(DemoError);
    expect((await projectService.list()).total).toBe(10);
    await projectService.reset();
    expect((await projectService.list()).total).toBe(12);
  });
  it("returns isolated values so callers cannot mutate storage", async () => {
    const record = await projectService.get("PRJ-001");
    record.members.push("Injected");
    expect((await projectService.get("PRJ-001")).members).toEqual(["Alex"]);
  });
});

it("batch changes update selected records and history without changing other records", async () => {
  const untouched = await projectService.get("PRJ-003");
  await projectService.updateMany(["PRJ-001", "PRJ-002"], { enabled: false, tags: ["Release"] });
  for (const id of ["PRJ-001", "PRJ-002"]) {
    const record = await projectService.get(id);
    expect(record.enabled).toBe(false);
    expect(record.tags).toEqual(["Release"]);
    expect(record.history.at(-1)?.action).toBe("Updated");
  }
  expect(await projectService.get("PRJ-003")).toEqual(untouched);
  await projectService.updateMany(["PRJ-001"], { enabled: true, tags: [] });
  expect((await projectService.get("PRJ-001")).tags).toEqual([]);
  expect((await projectService.get("PRJ-001")).enabled).toBe(true);
});
it("failed batches leave all records unchanged", async () => {
  const before = await projectService.list();
  await expect(
    projectService.updateMany(["PRJ-001"], { enabled: false }, "submit-error"),
  ).rejects.toThrow("Request failed");
  await expect(
    projectService.updateMany(["PRJ-001", "missing"], { tags: ["Changed"] }),
  ).rejects.toThrow("Record not found");
  expect(await projectService.list()).toEqual(before);
});
