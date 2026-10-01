import { useBlocker } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ConfirmDialog } from "new-api-admin-ui";
export function UnsavedGuard(props: { dirty: boolean; pending?: boolean }) {
  const { t } = useTranslation();
  const blocker = useBlocker({
    shouldBlockFn: () => props.dirty || Boolean(props.pending),
    enableBeforeUnload: props.dirty,
    withResolver: true,
  });
  return (
    <ConfirmDialog
      open={blocker.status === "blocked"}
      onOpenChange={(open) => {
        if (!open) blocker.reset?.();
      }}
      title={t("Discard changes?")}
      desc={t("Unsaved changes will be discarded.")}
      destructive
      disabled={props.pending}
      handleConfirm={() => blocker.proceed?.()}
    />
  );
}
