import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "new-api-admin-ui/ui/button";
import { TitledCard } from "new-api-admin-ui/ui/titled-card";
import { Alert, AlertTitle, AlertDescription } from "new-api-admin-ui/ui/alert";
import { Skeleton } from "new-api-admin-ui/ui/skeleton";
import { Spinner } from "new-api-admin-ui/ui/spinner";
import { Progress } from "new-api-admin-ui/ui/progress";
import { Popover, PopoverTrigger, PopoverContent } from "new-api-admin-ui/ui/popover";
import { Tooltip, TooltipTrigger, TooltipContent } from "new-api-admin-ui/ui/tooltip";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "new-api-admin-ui/ui/hover-card";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerFooter,
} from "new-api-admin-ui/ui/drawer";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  Dialog,
  ConfirmDialog,
  FloatingWindow,
} from "new-api-admin-ui";
export function FeedbackGallery() {
  const { t } = useTranslation();
  const [dialog, setDialog] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [floating, setFloating] = useState(false);
  const [progress, setProgress] = useState(45);
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <TitledCard title={t("Alerts and notifications")}>
        <div className="space-y-4">
          <Alert>
            <AlertTitle>{t("Information")}</AlertTitle>
            <AlertDescription>{t("This example uses demo data.")}</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertTitle>{t("Request failed")}</AlertTitle>
            <AlertDescription>{t("Please try again.")}</AlertDescription>
          </Alert>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => toast.success(t("Saved successfully"))}>{t("Success")}</Button>
            <Button variant="outline" onClick={() => toast.error(t("Request failed"))}>
              {t("Error")}
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                toast(t("Action completed"), {
                  action: { label: t("Undo"), onClick: () => toast(t("Restored")) },
                })
              }
            >
              {t("Undo notification")}
            </Button>
          </div>
        </div>
      </TitledCard>
      <TitledCard title={t("Loading and progress")}>
        <LoadingState />
        <div className="flex items-center gap-4">
          <Skeleton className="size-12 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Spinner />
        </div>
        <Progress className="mt-6" value={progress} />
        <Button variant="ghost" onClick={() => setProgress((value) => (value + 20) % 101)}>
          {t("Update progress")} · {progress}%
        </Button>
      </TitledCard>
      <TitledCard title={t("Empty and error states")}>
        <EmptyState />
        <ErrorState onRetry={() => toast(t("Retry requested"))} />
      </TitledCard>
      <TitledCard title={t("Dialogs and drawers")}>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setDialog(true)}>{t("Open dialog")}</Button>
          <Button variant="outline" onClick={() => setConfirm(true)}>
            {t("Confirm action")}
          </Button>
          <Button variant="outline" onClick={() => setFloating(true)}>
            {t("Floating window")}
          </Button>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline">{t("Bottom drawer")}</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>{t("Details")}</DrawerTitle>
                <DrawerDescription>{t("This example uses demo data.")}</DrawerDescription>
              </DrawerHeader>
              <div className="p-6">{t("Mobile-friendly content")}</div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button>{t("Close")}</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </TitledCard>
      <TitledCard title={t("Contextual information")}>
        <div className="flex flex-wrap gap-3">
          <Popover>
            <PopoverTrigger render={<Button variant="outline" />}>{t("Popover")}</PopoverTrigger>
            <PopoverContent>{t("This example uses demo data.")}</PopoverContent>
          </Popover>
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" />}>{t("Tooltip")}</TooltipTrigger>
            <TooltipContent>{t("Additional information")}</TooltipContent>
          </Tooltip>
          <HoverCard>
            <HoverCardTrigger render={<Button variant="link" />}>
              {t("Hover card")}
            </HoverCardTrigger>
            <HoverCardContent>{t("Additional information")}</HoverCardContent>
          </HoverCard>
        </div>
      </TitledCard>
      <Dialog
        open={dialog}
        onOpenChange={setDialog}
        title={t("Dialog")}
        description={t("This example uses demo data.")}
        footer={<Button onClick={() => setDialog(false)}>{t("Close")}</Button>}
      >
        <p>{t("Dialog content")}</p>
      </Dialog>
      <ConfirmDialog
        open={confirm}
        onOpenChange={setConfirm}
        title={t("Confirm action")}
        desc={t("This example uses demo data.")}
        handleConfirm={() => {
          setConfirm(false);
          toast.success(t("Action completed"));
        }}
      />
      {floating && (
        <FloatingWindow
          title={t("Floating window")}
          defaultPosition={{ x: 80, y: 100 }}
          defaultWidth={380}
          storageKey="new-api-admin:floating-demo"
          onClose={() => setFloating(false)}
        >
          <p className="p-5">{t("Drag, resize or collapse this window.")}</p>
        </FloatingWindow>
      )}
    </div>
  );
}
