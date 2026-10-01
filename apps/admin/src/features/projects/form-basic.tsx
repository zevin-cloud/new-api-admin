import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "new-api-admin-ui/form";
import { Input } from "new-api-admin-ui/ui/input";
import { Textarea } from "new-api-admin-ui/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "new-api-admin-ui/ui/select";
import { Combobox } from "new-api-admin-ui/ui/combobox";
import { RadioGroup, RadioGroupItem } from "new-api-admin-ui/ui/radio-group";
import { Label } from "new-api-admin-ui/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "new-api-admin-ui/ui/card";
import { MultiSelect, TagInput } from "new-api-admin-ui";
import type { ProjectValues } from "./schema";
export function BasicFields() {
  const { t } = useTranslation();
  const form = useFormContext<ProjectValues>();
  const disabled = form.formState.disabled;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Basic information")}</CardTitle>
        <CardDescription>{t("General information and ownership")}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Name")} *</FormLabel>
              <FormControl>
                <Input {...field} maxLength={80} />
              </FormControl>
              <FormDescription>{t("A short, recognizable name")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Email")} *</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="owner"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Owner")} *</FormLabel>
              <FormControl>
                <Combobox
                  options={["Alex", "Jamie", "Morgan", "Taylor"].map((name) => ({
                    label: name,
                    value: name,
                  }))}
                  value={field.value}
                  onValueChange={(value) => field.onChange(value ?? "")}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Status")}</FormLabel>
              <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue>{t(field.value)}</SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {["Active", "Draft", "Archived"].map((value) => (
                      <SelectItem key={value} value={value}>
                        {t(value)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Priority")}</FormLabel>
              <FormControl>
                <RadioGroup
                  className="flex gap-4"
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={disabled}
                >
                  {["Low", "Medium", "High"].map((value) => (
                    <Label key={value} className="flex items-center gap-2">
                      <RadioGroupItem value={value} />
                      {t(value)}
                    </Label>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Capacity")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  min={1}
                  max={1000}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormDescription>{t("Between 1 and 1000")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="members"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Members")}</FormLabel>
              <FormControl>
                <MultiSelect
                  options={["Alex", "Jamie", "Morgan", "Taylor"].map((value) => ({
                    value,
                    label: value,
                  }))}
                  selected={field.value}
                  onChange={field.onChange}
                  allowCreate
                  disabled={disabled}
                />
              </FormControl>
              <FormDescription>{t("Search, select or create an item")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Tags")}</FormLabel>
              <FormControl>
                <TagInput value={field.value} onChange={field.onChange} disabled={disabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>{t("Description")}</FormLabel>
              <FormControl>
                <Textarea {...field} rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
