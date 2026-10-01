import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Form } from "new-api-admin-ui/form";
import { ConfirmDialog } from "new-api-admin-ui";
import { Button } from "new-api-admin-ui/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "new-api-admin-ui/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "new-api-admin-ui/ui/alert";
import { Spinner } from "new-api-admin-ui/ui/spinner";
import { ProjectFormSections } from "./form-sections";
import { BasicFields } from "./form-basic";
import { AdvancedFields } from "./form-advanced";
import { projectDefaults, projectSchema, type Project, type ProjectValues } from "./schema";
import { DemoError, projectService } from "./service";
import { useDemo } from "../../components/demo-controls";
export interface ProjectFormProps {
  project?: Project;
  layout?: "tabs" | "sections";
  onSaved?: (item: Project) => void;
  onCancel?: () => void;
  onDirtyChange?: (dirty: boolean) => void;
  onPendingChange?: (pending: boolean) => void;
}
export function ProjectForm(props: ProjectFormProps) {
  const { t } = useTranslation();
  const { mode } = useDemo();
  const client = useQueryClient();
  const [savedProject, setSavedProject] = useState(props.project);
  const [tab, setTab] = useState("basic");
  const [resetOpen, setResetOpen] = useState(false);
  const disabled = mode === "readonly" || mode === "disabled";
  const form = useForm<ProjectValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: props.project ?? structuredClone(projectDefaults),
    disabled,
  });
  const save = useMutation({
    mutationFn: (values: ProjectValues) => projectService.save(values, savedProject?.id, mode),
    onSuccess: async (item) => {
      setSavedProject(item);
      form.reset(item);
      await client.invalidateQueries({ queryKey: ["projects"] });
      toast.success(t("Saved successfully"));
      props.onSaved?.(item);
    },
    onError: (error) => {
      if (error instanceof DemoError && error.field) {
        setTab("basic");
        form.setError(error.field, { message: error.message }, { shouldFocus: true });
      } else form.setError("root", { message: error.message });
    },
  });
  let statusTitle = "Unsaved changes";
  if (mode === "readonly") statusTitle = "Read only";
  else if (mode === "disabled") statusTitle = "Disabled";
  const dirty = form.formState.isDirty;
  useEffect(() => props.onDirtyChange?.(dirty), [dirty, props.onDirtyChange]);
  useEffect(() => props.onPendingChange?.(save.isPending), [save.isPending, props.onPendingChange]);
  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);
  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(
          (values) => save.mutate(values),
          (errors) => {
            const advanced = [
              "notificationEmail",
              "metadata",
              "milestones",
              "scheduledAt",
              "startDate",
            ];
            setTab(advanced.some((key) => key in errors) ? "advanced" : "basic");
          },
        )}
        className={props.layout === "sections" ? "flex min-h-0 flex-1 flex-col gap-4" : "space-y-6"}
      >
        {(disabled || dirty) && (
          <Alert>
            <AlertTitle>{t(statusTitle)}</AlertTitle>
            <AlertDescription>
              {t(
                disabled
                  ? "Switch the preview state to edit this form."
                  : "Your changes have not been saved.",
              )}
            </AlertDescription>
          </Alert>
        )}
        {form.formState.errors.root && (
          <Alert variant="destructive" role="alert">
            <AlertTitle>{t("Save failed")}</AlertTitle>
            <AlertDescription>
              {t(form.formState.errors.root.message ?? "Request failed")}
            </AlertDescription>
          </Alert>
        )}
        {props.layout === "sections" ? (
          <fieldset disabled={disabled || save.isPending} className="flex min-h-0 flex-1 flex-col">
            <ProjectFormSections />
          </fieldset>
        ) : (
          <Tabs value={tab} onValueChange={(value) => setTab(String(value))}>
            <TabsList className="mb-6">
              <TabsTrigger value="basic">{t("Basic information")}</TabsTrigger>
              <TabsTrigger value="advanced">{t("Advanced options")}</TabsTrigger>
            </TabsList>
            <TabsContent value="basic">
              <fieldset disabled={disabled || save.isPending} className="min-w-0">
                <BasicFields />
              </fieldset>
            </TabsContent>
            <TabsContent value="advanced">
              <fieldset disabled={disabled || save.isPending} className="min-w-0">
                <AdvancedFields />
              </fieldset>
            </TabsContent>
          </Tabs>
        )}
        <div className="bg-background sticky bottom-0 z-10 flex flex-wrap items-center justify-end gap-3 border-t py-4">
          <Button type="button" variant="ghost" disabled={save.isPending} onClick={props.onCancel}>
            {t("Cancel")}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={disabled || save.isPending}
            onClick={() => setResetOpen(true)}
          >
            {t("Reset")}
          </Button>
          <Button type="submit" disabled={disabled || save.isPending}>
            {save.isPending && <Spinner />}
            {t("Save changes")}
          </Button>
        </div>
        <ConfirmDialog
          open={resetOpen}
          onOpenChange={setResetOpen}
          title={t("Reset form?")}
          desc={t("Unsaved changes will be discarded.")}
          handleConfirm={() => {
            form.reset(savedProject ?? structuredClone(projectDefaults));
            setResetOpen(false);
          }}
        />
      </form>
    </Form>
  );
}
