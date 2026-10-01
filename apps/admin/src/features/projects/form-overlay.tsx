import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  sideDrawerContentClassName,
  sideDrawerHeaderClassName,
  ConfirmDialog,
  Dialog,
} from "new-api-admin-ui";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "new-api-admin-ui/ui/sheet";
import { ProjectForm } from "./project-form";
import type { Project } from "./schema";
export function FormOverlay(props: {
  variant: "dialog" | "drawer";
  project?: Project;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const [dirty, setDirty] = useState(false);
  const [pending, setPending] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const close = () => {
    if (pending) return;
    if (dirty) setConfirm(true);
    else props.onClose();
  };
  const content = (
    <ProjectForm
      layout={props.variant === "drawer" ? "sections" : "tabs"}
      project={props.project}
      onDirtyChange={setDirty}
      onPendingChange={setPending}
      onCancel={close}
      onSaved={props.onClose}
    />
  );
  return (
    <>
      {props.variant === "dialog" ? (
        <Dialog
          open
          onOpenChange={(open) => {
            if (!open) close();
          }}
          title={t(props.project ? "Edit project" : "Create project")}
          description={t("Complete form example")}
          contentClassName="sm:max-w-3xl"
        >
          {content}
        </Dialog>
      ) : (
        <Sheet
          open
          onOpenChange={(open) => {
            if (!open) close();
          }}
        >
          <SheetContent className={sideDrawerContentClassName("sm:max-w-7xl")}>
            <SheetHeader className={sideDrawerHeaderClassName("pr-12")}>
              <SheetTitle>{t(props.project ? "Edit project" : "Create project")}</SheetTitle>
              <SheetDescription>{t("Complete form example")}</SheetDescription>
            </SheetHeader>
            <div className="flex min-h-0 flex-1 flex-col px-4 pt-4 sm:px-6">{content}</div>
          </SheetContent>
        </Sheet>
      )}
      <ConfirmDialog
        open={confirm}
        onOpenChange={setConfirm}
        title={t("Discard changes?")}
        desc={t("Unsaved changes will be discarded.")}
        destructive
        handleConfirm={props.onClose}
      />
    </>
  );
}
