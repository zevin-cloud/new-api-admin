import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Bold, Italic, Plus, Search, Star } from "lucide-react";
import { Button } from "new-api-admin-ui/ui/button";
import { ButtonGroup } from "new-api-admin-ui/ui/button-group";
import { Badge } from "new-api-admin-ui/ui/badge";
import { Input } from "new-api-admin-ui/ui/input";
import { InputGroup, InputGroupInput, InputGroupAddon } from "new-api-admin-ui/ui/input-group";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "new-api-admin-ui/ui/input-otp";
import { Toggle } from "new-api-admin-ui/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "new-api-admin-ui/ui/toggle-group";
import { Label } from "new-api-admin-ui/ui/label";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldSet,
  FieldLegend,
} from "new-api-admin-ui/ui/field";
import { Avatar, AvatarImage, AvatarFallback } from "new-api-admin-ui/ui/avatar";
import { Kbd, KbdGroup } from "new-api-admin-ui/ui/kbd";
import { IconBadge } from "new-api-admin-ui/ui/icon-badge";
import { TitledCard } from "new-api-admin-ui/ui/titled-card";
import { ComboboxInput } from "new-api-admin-ui/ui/combobox-input";
import { CopyButton, MaskedValueDisplay, TableId, LearnMore, StatusBadge } from "new-api-admin-ui";
import { BadgeCell, BadgeListCell, StaticRowActions } from "new-api-admin-ui/data-table";
export function BasicGallery() {
  const { t } = useTranslation();
  const [otp, setOtp] = useState("");
  const [value, setValue] = useState("Alex");
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <TitledCard title={t("Buttons")} description={t("Variants and sizes")}>
        <div className="flex flex-wrap gap-3">
          {(["default", "secondary", "outline", "ghost", "destructive", "link"] as const).map(
            (variant) => (
              <Button
                key={variant}
                variant={variant}
                onClick={() => toast.success(t("Action completed"))}
              >
                {t(variant)}
              </Button>
            ),
          )}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {(["sm", "default", "lg"] as const).map((size) => (
            <Button
              key={size}
              size={size}
              variant="outline"
              onClick={() => toast(t("Action completed"))}
            >
              {t(size)}
            </Button>
          ))}
          <Button size="icon" aria-label={t("Add")} onClick={() => toast(t("Action completed"))}>
            <Plus />
          </Button>
          <Button disabled>{t("Disabled")}</Button>
        </div>
        <ButtonGroup className="mt-4">
          <Button variant="outline" onClick={() => toast(t("Saved successfully"))}>
            {t("Save")}
          </Button>
          <Button variant="outline" onClick={() => toast(t("Action completed"))}>
            {t("Preview")}
          </Button>
        </ButtonGroup>
      </TitledCard>
      <TitledCard title={t("Badges and avatars")}>
        <div className="flex flex-wrap items-center gap-3">
          <Badge>{t("Active")}</Badge>
          <Badge variant="secondary">{t("Draft")}</Badge>
          <Badge variant="destructive">{t("Error")}</Badge>
          <Badge variant="outline">{t("Archived")}</Badge>
          <IconBadge>
            <Star />
          </IconBadge>
          <Avatar>
            <AvatarImage src="/missing-avatar.png" alt="Alex" />
            <AvatarFallback>AL</AvatarFallback>
          </Avatar>
        </div>
        <div className="mt-5 flex items-center gap-3">
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
          <CopyButton value="new-api Admin" />
          <TableId value={42} />
        </div>
      </TitledCard>
      <TitledCard title={t("Input groups")}>
        <FieldSet>
          <FieldLegend>{t("Contact")}</FieldLegend>
          <Field>
            <FieldLabel htmlFor="gallery-email">{t("Email")}</FieldLabel>
            <InputGroup>
              <InputGroupAddon>@</InputGroupAddon>
              <InputGroupInput id="gallery-email" placeholder="name@example.com" />
            </InputGroup>
            <FieldDescription>{t("Demo only; no email is sent.")}</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="gallery-search">{t("Search")}</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
              <InputGroupInput id="gallery-search" />
            </InputGroup>
          </Field>
          <Field data-invalid>
            <FieldLabel htmlFor="gallery-invalid">{t("Invalid input")}</FieldLabel>
            <Input id="gallery-invalid" aria-invalid defaultValue="invalid" />
          </Field>
        </FieldSet>
      </TitledCard>
      <TitledCard
        title={t("Code input")}
        description={t("Control demonstration only; this value is not stored.")}
      >
        <Label htmlFor="gallery-otp">{t("Code")}</Label>
        <InputOTP id="gallery-otp" value={otp} onChange={setOtp} maxLength={6}>
          <InputOTPGroup>
            {[0, 1, 2].map((index) => (
              <InputOTPSlot key={index} index={index} />
            ))}
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            {[3, 4, 5].map((index) => (
              <InputOTPSlot key={index} index={index} />
            ))}
          </InputOTPGroup>
        </InputOTP>
        <p className="mt-4 text-sm text-muted-foreground">
          {t("Characters")}: {otp.length}/6
        </p>
      </TitledCard>
      <TitledCard title={t("Selection controls")}>
        <div className="flex flex-wrap gap-3">
          <Toggle aria-label={t("Bold")}>
            <Bold />
          </Toggle>
          <ToggleGroup multiple defaultValue={["bold"]}>
            <ToggleGroupItem value="bold" aria-label={t("Bold")}>
              <Bold />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label={t("Italic")}>
              <Italic />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="mt-5 space-y-2">
          <Label htmlFor="gallery-combo">{t("Owner")}</Label>
          <ComboboxInput
            id="gallery-combo"
            options={["Alex", "Jamie", "Taylor"].map((value) => ({ value, label: value }))}
            value={value}
            onValueChange={(next) => setValue(next ?? "")}
          />
        </div>
      </TitledCard>
      <TitledCard title={t("Copy and reveal")}>
        <div className="mb-5 space-y-3">
          <BadgeCell>
            <StatusBadge variant="success" label={t("Active")} copyable />
          </BadgeCell>
          <BadgeListCell
            expandable
            max={2}
            items={["Active", "Draft", "Archived"].map((value) => (
              <StatusBadge key={value} label={t(value)} />
            ))}
          />
          <StaticRowActions
            editLabel={t("Edit")}
            deleteLabel={t("Delete")}
            menuLabel={t("Actions")}
            onEdit={() => toast(t("Action completed"))}
            onDelete={() => toast(t("Deleted successfully"))}
          />
        </div>
        <MaskedValueDisplay
          label={t("Full value")}
          fullValue="DEMO-1234-5678"
          maskedValue="DEMO-••••-5678"
          copyTooltip={t("Copy")}
          copyAriaLabel={t("Copy")}
        />
        <LearnMore>{t("This example uses demo data.")}</LearnMore>
      </TitledCard>
    </div>
  );
}
