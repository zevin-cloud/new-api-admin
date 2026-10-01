import { useId } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Bell, FolderKanban, ListChecks, Settings2 } from "lucide-react";
import { FormSectionLayout, FormSection, type FormSectionItem } from "new-api-admin-ui";
import { Progress } from "new-api-admin-ui/ui/progress";
import { projectSchema, type ProjectValues } from "./schema";
import { BasicFields } from "./form-basic";
import { SchedulingFields, MilestoneFields, ExtraFields } from "./form-advanced";

// These section definitions belong to this example, so removing a group never changes the library.
export function ProjectFormSections() {
  const { t } = useTranslation();
  const prefix = useId();
  const form = useFormContext<ProjectValues>();
  const values = useWatch({ control: form.control });
  const result = projectSchema.safeParse(values);
  const invalid = new Set(
    result.success ? [] : result.error.issues.map((issue) => String(issue.path[0])),
  );
  const groups = [
    {
      key: "basic",
      label: t("Basic information"),
      icon: <FolderKanban />,
      fields: [
        "name",
        "description",
        "owner",
        "email",
        "status",
        "priority",
        "capacity",
        "tags",
        "members",
      ],
    },
    {
      key: "scheduling",
      label: t("Scheduling and notifications"),
      icon: <Bell />,
      fields: [
        "enabled",
        "notifications",
        "notificationEmail",
        "startDate",
        "scheduledAt",
        "progress",
      ],
    },
    { key: "milestones", label: t("Milestones"), icon: <ListChecks />, fields: ["milestones"] },
    {
      key: "advanced",
      label: t("Advanced options"),
      icon: <Settings2 />,
      fields: ["samplePassword", "metadata"],
    },
  ];
  const sections: FormSectionItem[] = groups.map((group) => {
    let status: FormSectionItem["status"] = "complete";
    if (group.fields.some((field) => invalid.has(field))) status = "incomplete";
    if (group.fields.some((field) => field in form.formState.errors)) status = "error";
    return { id: `${prefix}-${group.key}`, label: group.label, icon: group.icon, status };
  });
  const complete = sections.filter((section) => section.status === "complete").length;
  return (
    <FormSectionLayout
      sections={sections}
      summary={
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <FolderKanban className="size-8 text-primary" />
            <div className="min-w-0">
              <p className="truncate font-semibold">{values.name || t("Create project")}</p>
              <p className="text-xs text-muted-foreground">
                {t(values.enabled ? "Enabled" : "Disabled")}
              </p>
            </div>
          </div>
          <p role="status" className="text-sm text-muted-foreground">
            {t("{{complete}} of {{total}} sections complete", { complete, total: sections.length })}
          </p>
          <Progress value={(complete / sections.length) * 100} />
        </div>
      }
    >
      <FormSection id={`${prefix}-basic`} label={t("Basic information")}>
        <BasicFields />
      </FormSection>
      <FormSection id={`${prefix}-scheduling`} label={t("Scheduling and notifications")}>
        <SchedulingFields />
      </FormSection>
      <FormSection id={`${prefix}-milestones`} label={t("Milestones")}>
        <MilestoneFields />
      </FormSection>
      <FormSection id={`${prefix}-advanced`} label={t("Advanced options")}>
        <ExtraFields />
      </FormSection>
    </FormSectionLayout>
  );
}
