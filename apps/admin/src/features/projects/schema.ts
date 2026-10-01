import { z } from "zod";

export const projectSchema = z
  .object({
    name: z.string().trim().min(1, "Required").max(80, "Maximum 80 characters"),
    description: z.string().max(1000, "Maximum 1000 characters"),
    owner: z.string().min(1, "Required"),
    email: z.email("Invalid email address"),
    status: z.enum(["Active", "Draft", "Archived"]),
    priority: z.enum(["Low", "Medium", "High"]),
    capacity: z.number().int().min(1, "Must be at least 1").max(1000, "Must be at most 1000"),
    progress: z.number().min(0).max(100),
    tags: z.array(z.string()),
    members: z.array(z.string()),
    enabled: z.boolean(),
    notifications: z.boolean(),
    notificationEmail: z.string(),
    startDate: z.string(),
    scheduledAt: z.string(),
    samplePassword: z.string(),
    metadata: z.string().refine((value) => {
      try {
        const parsed: unknown = JSON.parse(value);
        return parsed !== null && typeof parsed === "object" && !Array.isArray(parsed);
      } catch {
        return false;
      }
    }, "Enter a JSON object"),
    milestones: z.array(
      z.object({ title: z.string().trim().min(1, "Required"), done: z.boolean() }),
    ),
  })
  .superRefine((value, ctx) => {
    if (value.notifications && !z.email().safeParse(value.notificationEmail).success)
      ctx.addIssue({
        code: "custom",
        path: ["notificationEmail"],
        message: "Invalid email address",
      });
  });
export type ProjectValues = z.infer<typeof projectSchema>;
export interface Project extends ProjectValues {
  id: string;
  updatedAt: string;
  history: { action: string; at: string }[];
}
export const projectDefaults: ProjectValues = {
  name: "",
  description: "",
  owner: "Alex",
  email: "alex@example.com",
  status: "Draft",
  priority: "Medium",
  capacity: 20,
  progress: 25,
  tags: ["Design"],
  members: ["Alex"],
  enabled: true,
  notifications: false,
  notificationEmail: "",
  startDate: "",
  scheduledAt: "",
  samplePassword: "",
  metadata: '{"region":"Shanghai"}',
  milestones: [{ title: "Research", done: false }],
};
