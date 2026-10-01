import { createContext, useContext, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { NativeSelect, NativeSelectOption } from "new-api-admin-ui/ui/native-select";
import { Button } from "new-api-admin-ui/ui/button";
import { Badge } from "new-api-admin-ui/ui/badge";
import { useQueryClient } from "@tanstack/react-query";
import { projectService, type DemoMode } from "../features/projects/service";
const modes: { value: DemoMode; label: string }[] = [
  { value: "ready", label: "Normal" },
  { value: "loading", label: "Loading" },
  { value: "empty", label: "Empty" },
  { value: "error", label: "Request failed" },
  { value: "submit-error", label: "Save failed" },
  { value: "field-error", label: "Field error" },
  { value: "readonly", label: "Read only" },
  { value: "disabled", label: "Disabled" },
];
const DemoContext = createContext<{ mode: DemoMode; setMode: (mode: DemoMode) => void }>({
  mode: "ready",
  setMode: () => {},
});
export function DemoProvider(props: { children: ReactNode }) {
  const [mode, setMode] = useState<DemoMode>("ready");
  return <DemoContext value={{ mode, setMode }}>{props.children}</DemoContext>;
}
export function useDemo() {
  return useContext(DemoContext);
}
export function DemoControls() {
  const { t } = useTranslation();
  const demo = useDemo();
  const client = useQueryClient();
  return (
    <div className="bg-muted/40 flex flex-wrap items-center gap-3 rounded-xl border px-4 py-3">
      <Badge variant="outline">{t("Demo data")}</Badge>
      <label htmlFor="demo-state" className="text-sm text-muted-foreground">
        {t("Preview state")}
      </label>
      <NativeSelect
        id="demo-state"
        value={demo.mode}
        onChange={(e) => demo.setMode(e.target.value as DemoMode)}
      >
        {modes.map((mode) => (
          <NativeSelectOption key={mode.value} value={mode.value}>
            {t(mode.label)}
          </NativeSelectOption>
        ))}
      </NativeSelect>
      <Button
        className="ms-auto"
        variant="ghost"
        size="sm"
        onClick={async () => {
          await projectService.reset();
          demo.setMode("ready");
          await client.invalidateQueries();
        }}
      >
        {t("Reset demo data")}
      </Button>
    </div>
  );
}
export function PageHeading(props: { title: string; description?: string; actions?: ReactNode }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t(props.title)}</h1>
        {props.description && (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t(props.description)}</p>
        )}
      </div>
      <div className="flex flex-wrap gap-2">{props.actions}</div>
    </div>
  );
}
