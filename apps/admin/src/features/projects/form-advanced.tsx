import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Plus, Trash2 } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "new-api-admin-ui/form";
import { DatePicker, DateTimePicker, JsonEditor, PasswordInput } from "new-api-admin-ui";
import { Input } from "new-api-admin-ui/ui/input";
import { Button } from "new-api-admin-ui/ui/button";
import { Switch } from "new-api-admin-ui/ui/switch";
import { Checkbox } from "new-api-admin-ui/ui/checkbox";
import { Slider } from "new-api-admin-ui/ui/slider";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "new-api-admin-ui/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "new-api-admin-ui/ui/accordion";
import type { ProjectValues } from "./schema";
export function AdvancedFields() {
  return (
    <div className="space-y-6">
      <SchedulingFields />
      <MilestoneFields />
      <ExtraFields />
    </div>
  );
}
export function SchedulingFields() {
  const { t } = useTranslation();
  const form = useFormContext<ProjectValues>();
  const disabled = form.formState.disabled;
  const notifications = useWatch({ control: form.control, name: "notifications" });
  const enabled = useWatch({ control: form.control, name: "enabled" });
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Scheduling and notifications")}</CardTitle>
        <CardDescription>{t("Fields respond to your selections")}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="enabled"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel>{t("Enabled")}</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notifications"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel>{t("Notifications")}</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={disabled || !enabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {notifications && (
          <FormField
            control={form.control}
            name="notificationEmail"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>{t("Notification email")} *</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Start date")}</FormLabel>
              <FormControl>
                <DatePicker
                  disabled={disabled}
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) => field.onChange(date?.toISOString() ?? "")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="scheduledAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Scheduled time")}</FormLabel>
              <FormControl>
                <DateTimePicker
                  disabled={disabled}
                  value={field.value ? new Date(field.value) : undefined}
                  onChange={(date) => field.onChange(date?.toISOString() ?? "")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="progress"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>
                {t("Progress")} · {field.value}%
              </FormLabel>
              <FormControl>
                <Slider
                  value={[field.value]}
                  min={0}
                  max={100}
                  onValueChange={(value) => field.onChange(Array.isArray(value) ? value[0] : value)}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
export function MilestoneFields() {
  const { t } = useTranslation();
  const form = useFormContext<ProjectValues>();
  const disabled = form.formState.disabled;
  const milestones = useFieldArray({ control: form.control, name: "milestones" });
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Milestones")}</CardTitle>
        <CardDescription>{t("Add or remove repeatable fields")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {milestones.fields.map((item, index) => (
          <div key={item.id} className="flex items-start gap-3">
            <FormField
              control={form.control}
              name={`milestones.${index}.done`}
              render={({ field }) => (
                <FormItem className="pt-7">
                  <FormControl>
                    <Checkbox
                      aria-label={t("Completed")}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={disabled}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`milestones.${index}.title`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>
                    {t("Milestone")} {index + 1}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="ghost"
              className="mt-6"
              size="icon"
              disabled={disabled}
              aria-label={t("Remove milestone")}
              onClick={() => milestones.remove(index)}
            >
              <Trash2 />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          onClick={() => milestones.append({ title: "", done: false })}
        >
          <Plus />
          {t("Add milestone")}
        </Button>
      </CardContent>
    </Card>
  );
}
export function ExtraFields() {
  const { t } = useTranslation();
  const form = useFormContext<ProjectValues>();
  const disabled = form.formState.disabled;
  return (
    <Accordion defaultValue={["advanced"]}>
      <AccordionItem value="advanced">
        <AccordionTrigger>{t("Advanced options")}</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-6 p-1">
            <FormField
              control={form.control}
              name="samplePassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Sample password")}</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} autoComplete="off" />
                  </FormControl>
                  <FormDescription>
                    {t("Control demonstration only; this value is not stored.")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="metadata"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Metadata")}</FormLabel>
                  <JsonEditor
                    value={field.value}
                    onChange={field.onChange}
                    valueType="any"
                    disabled={disabled}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
