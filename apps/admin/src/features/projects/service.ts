import { projectDefaults, projectSchema, type Project, type ProjectValues } from "./schema";
export type DemoMode =
  | "ready"
  | "loading"
  | "empty"
  | "error"
  | "submit-error"
  | "field-error"
  | "readonly"
  | "disabled";
export class DemoError extends Error {
  constructor(
    message: string,
    public field?: keyof ProjectValues,
  ) {
    super(message);
  }
}
export interface ProjectQuery {
  search?: string;
  status?: string[];
  priority?: string[];
  page?: number;
  pageSize?: number;
  sort?: { id: keyof Project; desc: boolean };
}
const names = [
  "Atlas website",
  "Customer portal",
  "Design system",
  "Mobile workspace",
  "Analytics dashboard",
  "Operations console",
  "Content library",
  "Partner platform",
  "Research archive",
  "Campaign studio",
  "Service desk",
  "Team directory",
];
function seed(): Project[] {
  return names.map((name, index) => ({
    ...structuredClone(projectDefaults),
    id: `PRJ-${String(index + 1).padStart(3, "0")}`,
    name,
    description: `${name} — A shared workspace for planning, collaboration and delivery. This intentionally long description demonstrates text truncation and expanded details.`,
    status: index % 3 === 0 ? "Draft" : "Active",
    priority: index % 3 === 0 ? "High" : "Medium",
    progress: 15 + index * 7,
    owner: index % 2 ? "Jamie" : "Alex",
    tags: index % 2 ? ["Engineering", "Design"] : ["Operations"],
    updatedAt: "2026-10-01T08:00:00.000Z",
    history: [{ action: "Created", at: "2026-10-01T08:00:00.000Z" }],
  }));
}
let projects = seed();
let sequence = 13;
// Replace this service with HTTP calls. Components depend only on these return types.
export const projectService = {
  async list(query: ProjectQuery = {}, mode: DemoMode = "ready") {
    if (mode === "error") throw new DemoError("Request failed");
    let items =
      mode === "empty"
        ? []
        : projects.filter(
            (p) =>
              (!query.search ||
                `${p.name} ${p.owner} ${p.description}`
                  .toLowerCase()
                  .includes(query.search.toLowerCase())) &&
              (!query.status?.length || query.status.includes(p.status)) &&
              (!query.priority?.length || query.priority.includes(p.priority)),
          );
    if (query.sort) {
      const { id, desc } = query.sort;
      items = [...items].sort((a, b) => {
        const av = a[id],
          bv = b[id];
        const compared =
          typeof av === "number" && typeof bv === "number"
            ? av - bv
            : String(av).localeCompare(String(bv));
        return desc ? -compared : compared;
      });
    }
    const total = items.length;
    if (query.pageSize)
      items = items.slice(
        (query.page ?? 0) * query.pageSize,
        ((query.page ?? 0) + 1) * query.pageSize,
      );
    return structuredClone({ items, total });
  },
  async get(id: string, mode: DemoMode = "ready") {
    if (mode === "error") throw new DemoError("Request failed");
    const item = projects.find((p) => p.id === id);
    if (!item || mode === "empty") throw new DemoError("Record not found");
    return structuredClone(item);
  },
  async save(values: ProjectValues, id?: string, mode: DemoMode = "ready") {
    if (mode === "submit-error") throw new DemoError("Save failed. Your changes are preserved.");
    if (mode === "field-error") throw new DemoError("This name is already in use", "name");
    const data = projectSchema.parse(values);
    const index = projects.findIndex((p) => p.id === id);
    if (id && index < 0) throw new DemoError("Record not found");
    const now = new Date().toISOString();
    const item: Project = {
      ...data,
      id: id ?? `PRJ-${String(sequence++).padStart(3, "0")}`,
      updatedAt: now,
      history: [
        ...(index >= 0 ? projects[index].history : []),
        { action: id ? "Updated" : "Created", at: now },
      ],
    };
    // The password field demonstrates a control only; no credential is stored.
    item.samplePassword = "";
    if (index >= 0) projects[index] = item;
    else projects.unshift(item);
    return structuredClone(item);
  },
  async remove(ids: string[], mode: DemoMode = "ready") {
    if (mode === "submit-error") throw new DemoError("Request failed");
    projects = projects.filter((item) => !ids.includes(item.id));
  },
  async archive(ids: string[], mode: DemoMode = "ready") {
    if (mode === "submit-error") throw new DemoError("Request failed");
    const now = new Date().toISOString();
    projects = projects.map((p) =>
      ids.includes(p.id)
        ? {
            ...p,
            status: "Archived",
            updatedAt: now,
            history: [...p.history, { action: "Archived", at: now }],
          }
        : p,
    );
  },
  async updateMany(
    ids: string[],
    changes: { enabled?: boolean; tags?: string[] },
    mode: DemoMode = "ready",
  ) {
    if (mode === "submit-error") throw new DemoError("Request failed");
    const targets = new Set(ids);
    if (ids.some((id) => !projects.some((project) => project.id === id)))
      throw new DemoError("Record not found");
    const now = new Date().toISOString();
    // Validate all replacements before committing so a failed batch is atomic.
    const next = projects.map((project) => {
      if (!targets.has(project.id)) return project;
      const values = projectSchema.parse({ ...project, ...changes });
      return {
        ...project,
        ...values,
        updatedAt: now,
        history: [...project.history, { action: "Updated", at: now }],
      };
    });
    projects = next;
  },
  async reset() {
    projects = seed();
    sequence = 13;
  },
};
