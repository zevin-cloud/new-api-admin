import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ConfirmDialog,
  ConfigDrawer,
  ThemeQuickSwitcher,
  LoadingState,
  ErrorState,
} from "new-api-admin-ui";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "new-api-admin-ui/form";
import { Button } from "new-api-admin-ui/ui/button";
import { Input } from "new-api-admin-ui/ui/input";
import { Textarea } from "new-api-admin-ui/ui/textarea";
import { Switch } from "new-api-admin-ui/ui/switch";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "new-api-admin-ui/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "new-api-admin-ui/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "new-api-admin-ui/ui/alert";
import { PageHeading, useDemo } from "../../components/demo-controls";
import { UnsavedGuard } from "../../components/unsaved-guard";
const defaults = {
  workspace: "new-api Admin",
  description: "A reusable administration workspace",
  notifications: true,
  email: "admin@example.com",
  digest: false,
};
let saved = { ...defaults };
export function SettingsPage() {
  const { t } = useTranslation();
  const { mode, setMode } = useDemo();
  const [tab, setTab] = useState("general");
  const [reset, setReset] = useState(false);
  const form = useForm({ defaultValues: saved });
  const disabled = mode === "readonly" || mode === "disabled";
  const notifications = form.watch("notifications");
  const save = useMutation({
    mutationFn: async (values: typeof defaults) => {
      if (mode === "submit-error") throw new Error("Save failed. Your changes are preserved.");
      if (mode === "field-error") {
        form.setError("workspace", { message: "This name is already in use" });
        setTab("general");
        return false;
      }
      saved = { ...values };
      return true;
    },
    onSuccess: (ok) => {
      if (ok) {
        form.reset(saved);
        toast.success(t("Saved successfully"));
      }
    },
    onError: (error) => form.setError("root", { message: error.message }),
  });
  return (
    <>
      <PageHeading
        title="Settings"
        description="Grouped settings with save, reset and appearance controls."
      />
      <UnsavedGuard dirty={form.formState.isDirty} pending={save.isPending} />
      {mode === "loading" ? (
        <LoadingState />
      ) : mode === "error" ? (
        <ErrorState onRetry={() => setMode("ready")} />
      ) : (
        <Form {...form}>
          <form
            className="space-y-6"
            noValidate
            onSubmit={form.handleSubmit((values) => save.mutate(values))}
          >
            {form.formState.isDirty && (
              <Alert>
                <AlertTitle>{t("Unsaved changes")}</AlertTitle>
                <AlertDescription>{t("Your changes have not been saved.")}</AlertDescription>
              </Alert>
            )}
            {form.formState.errors.root && (
              <Alert variant="destructive">
                <AlertTitle>{t("Save failed")}</AlertTitle>
                <AlertDescription>
                  {t(form.formState.errors.root.message ?? "Request failed")}
                </AlertDescription>
              </Alert>
            )}
            <Tabs value={tab} onValueChange={(value) => setTab(String(value))}>
              <TabsList className="mb-6">
                <TabsTrigger value="general">{t("General")}</TabsTrigger>
                <TabsTrigger value="notifications">{t("Notifications")}</TabsTrigger>
                <TabsTrigger value="appearance">{t("Appearance")}</TabsTrigger>
              </TabsList>
              <TabsContent value="general">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("General")}</CardTitle>
                    <CardDescription>{t("Workspace preferences")}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="workspace"
                      rules={{ required: "Required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Workspace name")}</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={disabled || save.isPending} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Description")}</FormLabel>
                          <FormControl>
                            <Textarea {...field} disabled={disabled || save.isPending} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("Notifications")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="notifications"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <FormLabel>{t("Enable notifications")}</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={disabled || save.isPending}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {notifications && (
                      <>
                        <FormField
                          control={form.control}
                          name="email"
                          rules={{
                            validate: (value) =>
                              /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "Invalid email address",
                          }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("Notification email")}</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="email"
                                  disabled={disabled || save.isPending}
                                />
                              </FormControl>
                              <FormDescription>{t("Demo only; no email is sent.")}</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="digest"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <FormLabel>{t("Daily summary")}</FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={disabled || save.isPending}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="appearance">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("Appearance")}</CardTitle>
                    <CardDescription>
                      {t("Theme preferences are saved automatically.")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ThemeQuickSwitcher />
                    <div className="flex items-center gap-3">
                      <span className="text-sm">
                        {t("Customize theme, font, radius, density and layout")}
                      </span>
                      <ConfigDrawer />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={disabled || save.isPending}
                onClick={() => setReset(true)}
              >
                {t("Restore defaults")}
              </Button>
              <Button type="submit" disabled={disabled || save.isPending}>
                {t("Save changes")}
              </Button>
            </div>
            <ConfirmDialog
              open={reset}
              onOpenChange={setReset}
              title={t("Restore defaults?")}
              desc={t("Unsaved changes will be discarded.")}
              handleConfirm={() => {
                form.reset(defaults, { keepDefaultValues: true });
                setReset(false);
              }}
            />
          </form>
        </Form>
      )}
    </>
  );
}
