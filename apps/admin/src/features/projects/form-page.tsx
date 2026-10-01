import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Switch } from "new-api-admin-ui/ui/switch";
import { Label } from "new-api-admin-ui/ui/label";
import { Button } from "new-api-admin-ui/ui/button";
import { ErrorState, LoadingState } from "new-api-admin-ui";
import { PageHeading, useDemo } from "../../components/demo-controls";
import { UnsavedGuard } from "../../components/unsaved-guard";
import { ProjectForm } from "./project-form";
import { FormOverlay } from "./form-overlay";
import { projectService } from "./service";
export function FormPage(props: {
  navigate: (href: string) => void;
  variant?: "dialog" | "drawer";
}) {
  const { t } = useTranslation();
  const { mode } = useDemo();
  const [sections, setSections] = useState(false);
  const [open, setOpen] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [pending, setPending] = useState(false);
  const [editing, setEditing] = useState(false);
  const query = useQuery({
    queryKey: ["projects", "detail", "PRJ-001", mode],
    queryFn: () => projectService.get("PRJ-001", mode),
    enabled: editing,
  });
  return (
    <>
      <PageHeading
        title={
          props.variant === "dialog"
            ? "Dialog form"
            : props.variant === "drawer"
              ? "Drawer form"
              : "Complete form"
        }
        description="All form controls and interactions in one editable example."
        actions={
          <>
            {!props.variant && (
              <div className="flex items-center gap-2">
                <Label htmlFor="form-sections">{t("Section navigation")}</Label>
                <Switch
                  id="form-sections"
                  checked={sections}
                  disabled={pending}
                  onCheckedChange={setSections}
                />
              </div>
            )}
            <Button
              variant="outline"
              disabled={dirty || pending}
              onClick={() => setEditing(!editing)}
            >
              {t(editing ? "Create project" : "Load edit example")}
            </Button>
          </>
        }
      />
      {props.variant ? (
        <>
          <Button className="self-start" onClick={() => setOpen(true)}>
            {t("Open form")}
          </Button>
          {open && (
            <FormOverlay
              variant={props.variant}
              project={editing ? query.data : undefined}
              onClose={() => setOpen(false)}
            />
          )}
        </>
      ) : mode === "loading" || (editing && query.isPending) ? (
        <LoadingState />
      ) : mode === "error" || (editing && query.isError) ? (
        <ErrorState onRetry={() => void query.refetch()} />
      ) : (
        <>
          <div className={sections ? "flex h-[75dvh] min-h-96 flex-col" : ""}>
            <ProjectForm
              layout={sections ? "sections" : "tabs"}
              key={editing ? query.data?.id : "new"}
              project={editing ? query.data : undefined}
              onDirtyChange={setDirty}
              onPendingChange={setPending}
              onCancel={() => props.navigate("/projects")}
            />
          </div>
          <UnsavedGuard dirty={dirty} pending={pending} />
        </>
      )}
    </>
  );
}
